const icons = {
    success: 'check-circle',
    warn: 'exclamation-circle',
    error: 'exclamation-circle',
    disallow: 'times-circle',
    info: 'info-circle'
};

/*
 * ======== Usage ========
 * Constructor:
 * let foo = new Toast({
 *	 message: The message that should be displayed,
 *	 type: The type of the toast. List can be seen above,
 *	 time: OPTIONAL The default delay before the toast disappears (in ms) default: 3000,
 *	 class: OPTIONAL ['class1', 'class2', ...],
 * })
 * Showing:
 * foo.show(OPTIONAL time in ms);
 *
 * Hiding:
 * foo.hide()
 */
export class Toast {
    static defaults = { time: 3000 };

    constructor(options) {
        this.hideTimeout = null;
        this.el = document.createElement('div');
        this.el.className = 'toast';
        this.messageDiv = document.createElement('div');
        this.messageDiv.className = 'toast-message';
        this.messageDiv.textContent = (typeof options === 'string' ? options : undefined) ?? options?.message ?? options?.msg ?? '';
        if (options && typeof options === 'object')
            if (options.class && typeof options.class === 'array')
                options.class.forEach((cl) => {
                    this.el.classList.add(cl);
                });

        this.time = options?.time ?? Toast.defaults.time;

        if (options?.type && icons[options.type]) {
            this.iconDiv = document.createElement('div');
            this.iconDiv.className = 'toast-icon';
            this.icon = document.createElement('i');
            this.icon.className = `fas fa-${icons[options.type]}`;
            this.iconDiv.appendChild(this.icon);
            this.el.appendChild(this.iconDiv);
        }
        this.el.appendChild(this.messageDiv);
        if (options?.closeButton ?? options?.closeBtn ?? true) {
            this.closeBtn = document.createElement('div');
            this.closeBtn.className = 'toast-close fas fa-times';
            this.closeBtn.addEventListener('click', () => {
                this.hide();
            });
            this.el.appendChild(this.closeBtn);
        }

        if (options?.type) this.el.classList.add(`toast--${options.type}`);

        document.body.appendChild(this.el);
    }

    show(time) {
        clearTimeout(this.hideTimeout);
        this.el.classList.add('toast--visible');
        this.hideTimeout = setTimeout(() => {
            this.el.classList.remove('toast--visible');
        }, time ?? this.time);
    }

    hide() {
        clearTimeout(this.hideTimeout);
        this.el.classList.remove('toast--visible');
    }
}
