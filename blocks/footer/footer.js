import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function getTextComponentTitle(component) {
  const content = component.querySelector('p') || component;
  const titleNode = [...content.childNodes]
    .find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
  return titleNode?.textContent.trim() || '';
}

function getListItemTitle(item) {
  const title = item.cloneNode(true);
  title.querySelector('ul')?.remove();
  return title.textContent.trim();
}

function createAccordion(title, links, index) {
  const accordion = document.createElement('div');
  accordion.className = 'cmp-accordion cmp-accordion--default';
  const item = document.createElement('div');
  item.className = 'cmp-accordion__item';
  const heading = document.createElement('h2');
  heading.className = 'cmp-accordion__header';
  heading.textContent = title;
  const panel = document.createElement('div');
  panel.className = 'cmp-accordion__panel';
  panel.id = `accordion-content-${index + 1}`;
  const list = document.createElement('ul');
  list.className = 'footer__accordion-list';

  links.forEach((sourceLink) => {
    const linkItem = document.createElement('li');
    linkItem.className = 'footer__accordion-link';
    const link = sourceLink.cloneNode(true);
    link.setAttribute('aria-label', link.textContent.trim());
    linkItem.append(link);
    list.append(linkItem);
  });

  panel.append(list);
  item.append(heading, panel);
  accordion.append(item);
  return accordion;
}

/**
 * Loads the footer fragment and maps each authored rich-text component to a link group.
 * The first text node is its title and every anchor inside it is a footer link.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  const textComponents = [...fragment.querySelectorAll('[data-aue-prop="text"], .default-content-wrapper')]
    .filter((component) => !component.parentElement.closest('[data-aue-prop="text"], .default-content-wrapper'));
  const groups = textComponents.flatMap((component) => {
    const list = component.querySelector('ul');
    if (list) {
      return [...list.querySelectorAll(':scope > li')].map((item) => ({
        title: getListItemTitle(item),
        links: [...item.querySelectorAll(':scope > ul a')],
      }));
    }
    return [{
      title: getTextComponentTitle(component),
      links: [...component.querySelectorAll('a')],
    }];
  }).filter(({ title, links }) => title && links.length);

  const footer = document.createElement('div');
  footer.className = 'footer__container';
  const primaryRow = document.createElement('div');
  primaryRow.className = 'footer__container-row';
  primaryRow.innerHTML = `
    <div class="footer__contact">
      <h2 class="footer__contact-header">Get in touch</h2>
      <strong>+44(0) 115 951 5151</strong><br><br>
      <span>Lines are open:</span><br>
      <span>Monday-Friday 9.00am-4.30pm</span><br><br>
      <address class="footer__contact-address" aria-label="University of Nottingham address">
        University of Nottingham<br>
        University Park<br>
        Nottingham, NG7 2RD<br>
        United Kingdom
      </address>
    </div>`;
  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'footer__accordion accordion panelcontainer';
  accordionContainer.dataset.inactive = '(min-width: 768px)';
  groups.forEach(({ title, links }, index) => {
    accordionContainer.append(createAccordion(title, links, index));
  });
  primaryRow.append(accordionContainer);

  const secondaryRow = document.createElement('div');
  secondaryRow.className = 'footer__container-row';
  secondaryRow.innerHTML = `
    <div class="footer__links">
      <ul class="footer_links-container">
        <li><a href="https://www.nottingham.ac.uk/utilities/privacy/privacy.aspx" aria-label="Privacy">Privacy</a></li>
        <li><a href="https://www.nottingham.ac.uk/utilities/terms.aspx" aria-label="Terms and conditions">Terms and conditions</a></li>
        <li><a href="https://www.nottingham.ac.uk/utilities/accessibility/accessibility.aspx" aria-label="Accessibility">Accessibility</a></li>
        <li><a href="https://www.nottingham.ac.uk/utilities/posting-rules.aspx" aria-label="Posting rules">Posting rules</a></li>
        <li><a href="https://www.nottingham.ac.uk/governance/records-and-information-management/freedom-of-information/freedom-of-information.aspx" aria-label="Freedom of information">Freedom of information</a></li>
        <li><a href="https://www.nottingham.ac.uk/governance/gateway.aspx" aria-label="Charity gateway">Charity gateway</a></li>
        <li><a href="https://www.nottingham.ac.uk/utilities/cookies.aspx" aria-label="Cookie policy">Cookie policy</a></li>
        <li><a href="https://www.nottingham.ac.uk/fabs/procurement/key-university-policies/policies.aspx" aria-label="Modern slavery statement">Modern slavery statement</a></li>
        <li><a href="https://www.nottingham.ac.uk/contact/" aria-label="Contact us">Contact us</a></li>
        <li><button id="ot-sdk-btn" class="ot-sdk-show-settings" type="button" aria-label="Open cookie settings">Cookies Settings</button></li>
      </ul>
      <p class="footer__copyright">Copyright 2010-<span class="footer__copyright-year">${new Date().getFullYear()}</span> University of Nottingham</p>
    </div>
    <div class="footer__socials">
      <ul>
        <li><a href="https://www.facebook.com/UniofNottingham/" aria-label="facebook" class="footer__socials-facebook"></a></li>
        <li><a href="https://www.instagram.com/uniofnottingham" aria-label="instagram" class="footer__socials-instagram"></a></li>
        <li><a href="https://www.youtube.com/channel/UCzdaFtpPWb-Pn6oYXQTCnxA" aria-label="youtube" class="footer__socials-youtube"></a></li>
        <li><a href="https://www.tiktok.com/@uniofnottingham?lang=en" aria-label="tiktok" class="footer__socials-tiktok"></a></li>
        <li><a href="https://www.linkedin.com/school/university-of-nottingham/" aria-label="linkedin" class="footer__socials-linkedin"></a></li>
      </ul>
    </div>`;

  footer.append(primaryRow, secondaryRow);
  block.replaceChildren(footer);
}
