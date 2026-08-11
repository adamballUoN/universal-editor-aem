import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function getItemLabel(item) {
  const label = item.cloneNode(true);
  label.querySelector('ul')?.remove();
  return label.textContent.trim();
}

function getTextComponentTitle(component) {
  const content = component.querySelector('p') || component;
  const titleNode = [...content.childNodes]
    .find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  return titleNode?.textContent.trim() || '';
}

function createSearch() {
  const search = document.createElement('div');
  search.className = 'search search-container';
  search.innerHTML = `
    <div class="search-container">
      <label for="search-input" class="visually-hidden">Search</label>
      <div class="search-bar">
        <input type="search" id="search-input" placeholder="Search for courses, subjects, careers..." aria-label="Search for courses, subjects, careers...">
        <span class="search-bar-icon"></span>
        <button class="search-bar-clear" type="button" aria-label="Clear search" aria-hidden="true" tabindex="-1">Clear</button>
      </div>
      <button class="button button--dark button--outline button--medium button--icon--dark--outline button--icon--single--medium--cross searchClose" type="button" aria-label="Close search"></button>
    </div>`;
  return search;
}

function createNavigation(sourceLists, textComponents) {
  const navigation = document.createElement('div');
  navigation.className = 'headerv2-nav';
  navigation.setAttribute('aria-label', 'Main navigation');
  navigation.setAttribute('role', 'navigation');
  const backButton = document.createElement('button');
  backButton.className = 'headerv2-nav__back-btn';
  backButton.type = 'button';
  backButton.textContent = 'Back to menu';
  backButton.setAttribute('aria-label', 'Back to main menu');
  backButton.setAttribute('aria-hidden', 'true');
  navigation.append(backButton);

  const menu = document.createElement('ul');
  menu.className = 'headerv2-nav-level-1';
  menu.setAttribute('aria-label', 'Main menu');
  const entries = [];

  const sourceItems = [
    ...sourceLists.flatMap((sourceList) => [...sourceList.querySelectorAll(':scope > li')]),
    ...textComponents,
  ];
  sourceItems.forEach((sourceItem, index) => {
    const isTextComponent = sourceItem.matches('[data-aue-prop="text"]');
    const label = isTextComponent ? getTextComponentTitle(sourceItem) : getItemLabel(sourceItem);
    const links = sourceItem.querySelector(':scope > ul');
    const directLink = sourceItem.querySelector(':scope > a, :scope > p > a');
    if (!label) return;

    const item = document.createElement('li');
    if (!links && directLink) {
      const link = directLink.cloneNode(true);
      link.className = 'headerv2-nav-level-1-btn';
      item.append(link);
      menu.append(item);
      return;
    }

    const id = `lvl1-${index}`;
    const button = document.createElement('button');
    button.className = 'headerv2-nav-level-1-btn';
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-expanded', 'false');

    const panel = document.createElement('div');
    panel.id = id;
    panel.className = 'headerv2-nav-level-2';
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', `${label} submenu`);
    panel.setAttribute('aria-hidden', 'true');
    const content = document.createElement('div');
    content.className = 'headerv2-nav-level-2__content';
    const addColumn = (columnTitle, sourceLinks) => {
      const column = document.createElement('div');
      column.className = 'headerv2-nav-level-2__content-column';
      const title = document.createElement('span');
      title.className = 'headerv2-nav-level-2__content-column-title';
      title.textContent = columnTitle;
      const linkList = document.createElement('ul');
      linkList.className = 'headerv2-nav-level-2__content-column-links';

      sourceLinks.forEach((sourceLink) => {
        const link = sourceLink.matches('a')
          ? sourceLink
          : sourceLink.querySelector(':scope > a, :scope > p > a');
        if (!link) return;
        const linkItem = document.createElement('li');
        const copiedLink = link.cloneNode(true);
        copiedLink.className = 'headerv2-nav-level-2__content-column-link';
        linkItem.append(copiedLink);
        linkList.append(linkItem);
      });

      column.append(title, linkList);
      content.append(column);
    };

    if (isTextComponent) {
      addColumn(label, [...sourceItem.querySelectorAll('a')]);
    } else {
      const addNestedColumns = (title, items) => {
        let columnTitle = title;
        let columnLinks = [];
        const addCurrentColumn = () => {
          if (columnTitle && columnLinks.length) addColumn(columnTitle, columnLinks);
          columnLinks = [];
        };

        items.forEach((sourceColumn) => {
          const link = sourceColumn.querySelector(':scope > a, :scope > p > a');
          const nestedList = sourceColumn.querySelector(':scope > ul');
          if (link) {
            columnLinks.push(sourceColumn);
          } else {
            addCurrentColumn();
            const nestedTitle = getItemLabel(sourceColumn);
            if (nestedList) {
              addNestedColumns(nestedTitle, [...nestedList.querySelectorAll(':scope > li')]);
              columnTitle = '';
            } else {
              columnTitle = nestedTitle;
            }
          }
        });
        addCurrentColumn();
      };

      addNestedColumns(label, [...(links?.querySelectorAll(':scope > li') || [])]);
    }

    panel.append(content);
    item.append(button, panel);
    menu.append(item);
    entries.push({ button, panel });
  });

  navigation.append(menu);
  return { navigation, entries, backButton };
}

/**
 * Loads and decorates the header using the supplied headerv2 normal and open states.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  const sections = [...fragment.children];
  const brand = sections[0]?.querySelector('a')?.cloneNode(true);
  const sourceLists = sections.slice(1).flatMap((section) => [...section.querySelectorAll('ul')])
    .filter((list) => !list.parentElement.closest('ul'));
  const textComponents = sections.slice(1).flatMap((section) => [
    ...section.querySelectorAll('[data-aue-prop="text"]'),
  ]).filter((component) => !component.querySelector('ul'));

  const component = document.createElement('div');
  component.className = 'headerv2-component';
  const skip = document.createElement('div');
  skip.className = 'headerv2-skip-content-link';
  skip.innerHTML = '<button class="headerv2-skip-content-button body-medium" type="button">Skip to main content</button>';
  const status = document.createElement('div');
  status.id = 'flyout-status';
  status.className = 'sr-visable-only';
  status.setAttribute('aria-live', 'polite');
  status.textContent = 'Menu closed';

  const header = document.createElement('div');
  header.className = 'headerv2';
  const container = document.createElement('div');
  container.className = 'headerv2-container';
  const top = document.createElement('div');
  top.className = 'headerv2__top';

  const logo = document.createElement('img');
  logo.src = 'https://www.nottingham.ac.uk/etc.clientlibs/uon/clientlibs/clientlib-site/resources/images/Logo-white.svg';
  logo.alt = 'University of Nottingham Logo';
  logo.className = 'headerv2__logo-img';
  logo.loading = 'lazy';
  logo.height = 72;
  logo.width = 197;
    if (brand) {
      brand.className = 'headerv2__logo';
      brand.setAttribute('aria-label', 'Go to University of Nottingham homepage');
      brand.setAttribute('title', 'Go to University of Nottingham homepage');
      brand.innerHTML = logo.outerHTML;
      top.append(brand);
    }

  const search = createSearch();
  const searchOpen = document.createElement('button');
  searchOpen.className = 'button button--dark button--outline button--medium button--icon--dark--outline button--icon--single--medium--search searchOpen';
  searchOpen.type = 'button';
  searchOpen.setAttribute('aria-label', 'Open search bar');
  const openMenu = document.createElement('button');
  openMenu.className = 'button button--dark button--outline button--medium button--icon--dark--outline button--icon--single--medium--hamburger menuOpen';
  openMenu.type = 'button';
  openMenu.setAttribute('aria-label', 'Menu - Open navigation');
  openMenu.setAttribute('aria-controls', 'flyoutNav');
  openMenu.setAttribute('aria-expanded', 'false');
  openMenu.style.display = 'block';
  const closeMenu = document.createElement('button');
  closeMenu.className = 'button button--dark button--outline button--medium button--icon--dark--outline button--icon--single--medium--cross menuClose';
  closeMenu.type = 'button';
  closeMenu.setAttribute('aria-label', 'Close navigation');
  closeMenu.setAttribute('aria-controls', 'flyoutNav');
  closeMenu.style.display = 'none';
  top.append(search, searchOpen, openMenu, closeMenu);
  container.append(top);

  const flyout = document.createElement('div');
  flyout.className = 'flyout';
  flyout.id = 'flyoutNav';
  flyout.setAttribute('aria-hidden', 'true');
  flyout.setAttribute('inert', '');
  const flyoutTop = document.createElement('div');
  flyoutTop.className = 'flyout-top';
  const flyoutInner = document.createElement('div');
  flyoutInner.className = 'flyout-inner';
  const { navigation, entries, backButton } = createNavigation(sourceLists, textComponents);
  flyoutInner.append(navigation);
  flyout.append(flyoutTop, flyoutInner);
  header.append(container, flyout);
  component.append(skip, status, header);

  const setActiveEntry = (entry) => {
    entries.forEach(({ button, panel }) => {
      const active = button === entry?.button;
      button.classList.toggle('activeBtn', active);
      button.classList.toggle('inactiveBtn', !active);
      button.setAttribute('aria-expanded', active);
      panel.classList.toggle('show', active);
      panel.setAttribute('aria-hidden', !active);
    });
  };
  const closeFlyout = () => {
    flyout.classList.remove('active');
    flyout.setAttribute('aria-hidden', 'true');
    flyout.setAttribute('inert', '');
    openMenu.setAttribute('aria-expanded', 'false');
    flyoutTop.replaceChildren();
    container.append(top);
    openMenu.style.display = 'block';
    closeMenu.style.display = 'none';
    status.textContent = 'Menu closed';
    document.body.style.overflow = '';
    setActiveEntry();
  };
  const openFlyout = () => {
    flyoutTop.append(top);
    flyout.classList.add('active');
    flyout.setAttribute('aria-hidden', 'false');
    flyout.removeAttribute('inert');
    openMenu.setAttribute('aria-expanded', 'true');
    openMenu.style.display = 'none';
    closeMenu.style.display = 'block';
    status.textContent = 'Menu opened';
    document.body.style.overflow = 'hidden';
    setActiveEntry(entries[0]);
  };

  openMenu.addEventListener('click', openFlyout);
  closeMenu.addEventListener('click', closeFlyout);
  entries.forEach((entry) => entry.button.addEventListener('click', () => setActiveEntry(entry)));
  backButton.addEventListener('click', () => setActiveEntry());
  searchOpen.addEventListener('click', () => {
    search.classList.add('open');
    search.querySelector('input').focus();
  });
  search.querySelector('.searchClose').addEventListener('click', () => search.classList.remove('open'));
  search.querySelector('.search-bar-clear').addEventListener('click', () => {
    const input = search.querySelector('input');
    input.value = '';
    input.focus();
  });
  skip.querySelector('button').addEventListener('click', () => document.querySelector('main')?.focus());
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && flyout.classList.contains('active')) {
      closeFlyout();
      openMenu.focus();
    }
  });

  block.replaceChildren(component);
}
