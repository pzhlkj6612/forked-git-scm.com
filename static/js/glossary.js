var GitGlossary = {
  term: null,
  tooltip: null,

  init: function() {
    const content = document.querySelector('#content');
    if (!content) return;

    // Create the popover element
    document.body.insertAdjacentHTML('beforeend',
      '<div class="tooltip"><div class="tooltip-content"></div></div>'
    );
    this.tooltip = document.body.lastElementChild;
    window.addEventListener('resize', () => this.reposition());
    this.attachHoverEvents(content);
  },

  show: function() {
    this.tooltip.classList.add('show');
    this.reposition();
  },

  hide: function() {
    this.tooltip.classList.remove('show');
  },

  reposition: function() {
    const result = NanoPop.reposition(this.term, this.tooltip, {
      position: 'bottom',
      margin: -7,
      container: {
        top: 0,
        left: 0,
        bottom: window.innerHeight,
        right: window.innerWidth
      }
    });
  },

  attachHoverEvents: function(content) {
    content.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('hover-term')) {
        console.log(this.term);
        this.term = e.target;
        const term = e.target.dataset.term;
        // Definition HTML is embedded directly in the element by Hugo so that
        // links use the correct baseURL-aware paths.
        const definition = e.target.dataset.definition || '';
        const truncatedDefinition = this.truncateWords(definition, 60);

        const language = document.querySelector("html")?.getAttribute("lang") || 'en';
        const glossaryUrl = language === 'en' ? baseURLPrefix + 'docs/gitglossary' : baseURLPrefix + `docs/gitglossary/${language}`;
        
        this.tooltip.querySelector('.tooltip-content').innerHTML = `
            <a href="${glossaryUrl}#def_${term}" target="_blank">
              <strong>&lt;${term}&gt;</strong>
            </a>
            <br><br>
            ${truncatedDefinition}
          `;
        this.show();
      }
    });

    content.addEventListener('mouseout', (e) => {
      if (e.target.classList.contains('hover-term')) {
        this.hide();
      }
    });

    // Keep popover open when hovering over it
    this.tooltip.addEventListener('mouseenter', () => {
      this.show();
    });

    this.tooltip.addEventListener('mouseleave', () => {
      this.hide();
    });
  },

  truncateWords: function(text, maxWords) {
    const words = text.split(/\s+/);
    if (words.length <= maxWords) {
      return text;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  },
};

// Initialize when document is ready
$(document).ready(() => {
  GitGlossary.init();
});
