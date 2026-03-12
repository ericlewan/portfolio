(function () {
  // ─── Always register styles first ────────────────────────────
  CMS.registerPreviewStyle(
    'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400;1,600' +
    '&family=Geist:wght@300;400;500&family=Geist+Mono:wght@300;400;500&display=swap'
  );
  CMS.registerPreviewStyle('/admin/preview.css');

  // ─── React-compatible createElement — no external React needed ─
  // Symbol.for() is shared across all JS in the same tab, so Decap's
  // bundled React will recognise elements produced here as valid.
  var REACT_ELEMENT = Symbol.for('react.element');

  function h(type, props) {
    var children = [];
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c !== null && c !== undefined && c !== false && c !== '') children.push(c);
    }
    return {
      $$typeof: REACT_ELEMENT,
      type: type,
      key: null,
      ref: null,
      props: Object.assign({}, props || {}, {
        children: children.length === 0 ? undefined
                : children.length === 1 ? children[0]
                : children,
      }),
      _owner: null,
      _store: {},
    };
  }

  // ─── Helpers ─────────────────────────────────────────────────
  function get(entry, key) {
    return entry.getIn(['data', key]) || '';
  }

  function formatDate(str) {
    if (!str) return '';
    try {
      return new Date(str + 'T12:00:00Z').toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch (e) { return str; }
  }

  // ─── Blog Post Preview ────────────────────────────────────────
  var BlogPreview = function (props) {
    var entry = props.entry;
    var title = get(entry, 'title');
    var date  = get(entry, 'date');

    return h('div', {},
      h('header', { className: 'post-header' },
        h('p',  { className: 'cs-eyebrow' }, formatDate(date)),
        h('h1', {
          className: 'cs-title',
          dangerouslySetInnerHTML: { __html: title || 'Untitled' },
        })
      ),
      h('div', { className: 'post-inner' },
        h('div', { className: 'post-body' },
          props.widgetFor('body')
        )
      )
    );
  };

  // ─── Case Study Preview ───────────────────────────────────────
  var CaseStudyPreview = function (props) {
    var entry        = props.entry;
    var title        = get(entry, 'title');
    var eyebrow      = get(entry, 'eyebrow');
    var intro        = get(entry, 'intro');
    var company      = get(entry, 'company');
    var companyUrl   = get(entry, 'companyUrl');
    var role         = get(entry, 'role');
    var timeline     = get(entry, 'timeline');
    var heroImage    = get(entry, 'heroImage');
    var heroImageAlt = get(entry, 'heroImageAlt');
    var heroBg       = get(entry, 'heroBg') || 'pale';

    var bgColors = {
      pale:         '#F5F7FF',
      light:        '#F0F4FF',
      blue:         '#E8F0FF',
      dark:         '#141825',
      'dark-green': '#0D1A12',
      headway:      '#FFF8F4',
    };

    return h('div', {},

      h('header', { className: 'cs-header' },
        h('p', { className: 'cs-eyebrow' }, eyebrow),
        h('h1', {
          className: 'cs-title',
          dangerouslySetInnerHTML: { __html: title || 'Untitled' },
        }),
        intro && h('p', { className: 'cs-intro' }, intro),
        h('div', { className: 'cs-meta' },
          role && h('div', { className: 'cs-meta-item' },
            h('p', { className: 'cs-meta-label' }, 'Role'),
            h('p', { className: 'cs-meta-value' }, role)
          ),
          timeline && h('div', { className: 'cs-meta-item' },
            h('p', { className: 'cs-meta-label' }, 'Timeline'),
            h('p', { className: 'cs-meta-value' }, timeline)
          ),
          company && h('div', { className: 'cs-meta-item' },
            h('p', { className: 'cs-meta-label' }, 'Company'),
            h('p', { className: 'cs-meta-value' },
              companyUrl
                ? h('a', { className: 'cs-meta-link', href: companyUrl, target: '_blank' },
                    company + ' ↗')
                : company
            )
          )
        )
      ),

      heroImage && h('div', {
        style: { background: bgColors[heroBg] || bgColors.pale },
      },
        h('img', {
          className: 'cs-hero-img',
          src: heroImage,
          alt: heroImageAlt,
        })
      ),

      h('div', { className: 'cs-body' },
        props.widgetFor('body')
      )
    );
  };

  // ─── Register ─────────────────────────────────────────────────
  CMS.registerPreviewTemplate('blog', BlogPreview);
  CMS.registerPreviewTemplate('case-studies', CaseStudyPreview);
})();
