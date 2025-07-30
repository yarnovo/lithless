import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
 * Custom event detail for date picker change events
 */
export interface DatePickerChangeDetail {
  value: string;
  date: Date | null;
  formattedValue: string;
}

/**
 * Custom event detail for date picker input events
 */
export interface DatePickerInputDetail {
  value: string;
  inputValue: string;
}

/**
 * Date picker calendar view types
 */
export type CalendarView = 'days' | 'months' | 'years';

/**
 * A headless date picker component that provides complete date selection functionality
 * without any predefined styles.
 *
 * @element lith-date-picker
 *
 * @fires {CustomEvent<DatePickerChangeDetail>} lith-change - Fired when the selected date changes
 * @fires {CustomEvent<DatePickerInputDetail>} lith-input - Fired when the user types in the input
 * @fires {FocusEvent} lith-focus - Fired when the date picker gains focus
 * @fires {FocusEvent} lith-blur - Fired when the date picker loses focus
 * @fires {CustomEvent} lith-open - Fired when the calendar opens
 * @fires {CustomEvent} lith-close - Fired when the calendar closes
 *
 * @slot trigger-icon - The icon to display in the input field
 * @slot prev-button - Custom previous month/year button
 * @slot next-button - Custom next month/year button
 *
 * @csspart base - The component's root element
 * @csspart input - The input field
 * @csspart icon - The calendar icon container
 * @csspart calendar - The calendar container
 * @csspart header - The calendar header
 * @csspart navigation - The navigation controls
 * @csspart prev-button - The previous navigation button
 * @csspart next-button - The next navigation button
 * @csspart title - The calendar title (month/year)
 * @csspart weekdays - The weekdays header
 * @csspart weekday - Individual weekday labels
 * @csspart days - The days grid container
 * @csspart day - Individual day cells
 * @csspart day-button - Day button elements
 * @csspart months - The months grid container
 * @csspart month - Individual month cells
 * @csspart month-button - Month button elements
 * @csspart years - The years grid container
 * @csspart year - Individual year cells
 * @csspart year-button - Year button elements
 *
 * @cssprop [--lith-date-picker-input-padding=8px 12px] - Padding for the input field
 * @cssprop [--lith-date-picker-input-gap=8px] - Gap between input and icon
 * @cssprop [--lith-date-picker-calendar-width=280px] - Width of the calendar
 * @cssprop [--lith-date-picker-calendar-offset=4px] - Offset between input and calendar
 * @cssprop [--lith-date-picker-cell-size=40px] - Size of calendar cells
 * @cssprop [--lith-date-picker-focus-ring-width=2px] - Focus ring width
 * @cssprop [--lith-date-picker-focus-ring-offset=2px] - Focus ring offset
 * @cssprop [--lith-date-picker-transition-duration=200ms] - Transition duration
 */
@customElement('lith-date-picker')
export class LithDatePicker extends LitElement {
  static formAssociated = true;

  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
      vertical-align: middle;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
      cursor: not-allowed;
      pointer-events: none;
    }

    :host([readonly]) {
      cursor: default;
    }

    .base {
      position: relative;
      display: inline-block;
      width: 100%;
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--lith-date-picker-input-gap, 8px);
    }

    .input {
      flex: 1;
      padding: var(--lith-date-picker-input-padding, 8px 12px);
      min-height: 40px;
      box-sizing: border-box;
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: inherit;
      color: inherit;
      cursor: pointer;
    }

    .input:focus {
      outline: none;
    }

    :host(:focus-within) .input {
      outline: var(--lith-date-picker-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-date-picker-focus-ring-offset, 2px);
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      flex-shrink: 0;
    }

    .calendar {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 1000;
      margin-top: var(--lith-date-picker-calendar-offset, 4px);
      width: var(--lith-date-picker-calendar-width, 280px);
      background: inherit;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition:
        opacity var(--lith-date-picker-transition-duration, 200ms),
        visibility var(--lith-date-picker-transition-duration, 200ms),
        transform var(--lith-date-picker-transition-duration, 200ms);
    }

    .calendar.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
    }

    .navigation {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
    }

    .nav-button:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .nav-button:focus {
      outline: var(--lith-date-picker-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-date-picker-focus-ring-offset, 2px);
    }

    .title {
      font-weight: 600;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .title:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .title:focus {
      outline: var(--lith-date-picker-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-date-picker-focus-ring-offset, 2px);
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 1px;
      padding: 0 12px;
      margin-bottom: 8px;
    }

    .weekday {
      display: flex;
      align-items: center;
      justify-content: center;
      height: var(--lith-date-picker-cell-size, 40px);
      font-size: 12px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.6);
      text-transform: uppercase;
    }

    .days,
    .months,
    .years {
      display: grid;
      gap: 1px;
      padding: 0 12px 12px;
    }

    .days {
      grid-template-columns: repeat(7, 1fr);
    }

    .months {
      grid-template-columns: repeat(3, 1fr);
    }

    .years {
      grid-template-columns: repeat(4, 1fr);
    }

    .day,
    .month,
    .year {
      display: flex;
      align-items: center;
      justify-content: center;
      height: var(--lith-date-picker-cell-size, 40px);
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      position: relative;
    }

    .day:hover,
    .month:hover,
    .year:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .day:focus,
    .month:focus,
    .year:focus {
      outline: var(--lith-date-picker-focus-ring-width, 2px) solid currentColor;
      outline-offset: var(--lith-date-picker-focus-ring-offset, 2px);
    }

    .day.other-month {
      color: rgba(0, 0, 0, 0.4);
    }

    .day.selected,
    .month.selected,
    .year.selected {
      background: currentColor;
      color: white;
    }

    .day.today {
      font-weight: 600;
    }

    .day.today::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
    }

    .day.selected.today::after {
      background: white;
    }

    .hidden {
      display: none;
    }
  `;

  private _internals?: ElementInternals;

  @property({ type: String, reflect: true }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) name = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String }) format = 'YYYY-MM-DD';
  @property({ type: String }) locale = 'en';
  @property({ type: String }) min = '';
  @property({ type: String }) max = '';

  @state() private _open = false;
  @state() private _inputValue = '';
  @state() private _currentView: CalendarView = 'days';
  @state() private _viewDate = new Date();
  @state() private _selectedDate: Date | null = null;

  private _documentClickHandler = this._handleDocumentClick.bind(this);

  constructor() {
    super();
    try {
      this._internals = this.attachInternals();
    } catch {
      // Fallback for environments without ElementInternals support
    }
    this._updateInputValue();
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._documentClickHandler, true);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._documentClickHandler, true);
  }

  override willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('value')) {
      this._updateFromValue();
      this._updateFormValue();
    }
  }

  private _updateFromValue() {
    if (this.value) {
      const date = this._parseDate(this.value);
      if (date && !isNaN(date.getTime())) {
        this._selectedDate = date;
        this._viewDate = new Date(date);
      } else {
        this._selectedDate = null;
      }
    } else {
      this._selectedDate = null;
    }
    this._updateInputValue();
  }

  private _updateInputValue() {
    if (this._selectedDate) {
      this._inputValue = this._formatDate(this._selectedDate);
    } else {
      this._inputValue = this.value;
    }
  }

  private _updateFormValue() {
    if (!this._internals || typeof this._internals.setFormValue !== 'function') return;

    if (this.value) {
      this._internals.setFormValue(this.value);
    } else {
      this._internals.setFormValue(null);
    }
  }

  private _parseDate(dateString: string): Date | null {
    // Simple ISO date parsing (YYYY-MM-DD)
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return null;
  }

  private _formatDate(date: Date): string {
    // Simple ISO date formatting (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private _getDateValue(date: Date): string {
    return this._formatDate(date);
  }

  private _isDateInRange(date: Date): boolean {
    const minDate = this.min ? this._parseDate(this.min) : null;
    const maxDate = this.max ? this._parseDate(this.max) : null;

    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  }

  private _isSameDate(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private _isToday(date: Date): boolean {
    const today = new Date();
    return this._isSameDate(date, today);
  }

  private _getMonthName(month: number): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[month];
  }

  private _getWeekdayNames(): string[] {
    return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  }

  private _getMonthNames(): string[] {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  private _getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private _getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
  }

  private _generateCalendarDays(): Array<{
    date: Date;
    day: number;
    isOtherMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
    isDisabled: boolean;
  }> {
    const year = this._viewDate.getFullYear();
    const month = this._viewDate.getMonth();
    const daysInMonth = this._getDaysInMonth(year, month);
    const firstDay = this._getFirstDayOfMonth(year, month);
    const days = [];

    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = this._getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(prevYear, prevMonth, day);
      days.push({
        date,
        day,
        isOtherMonth: true,
        isSelected: this._isSameDate(date, this._selectedDate),
        isToday: this._isToday(date),
        isDisabled: !this._isDateInRange(date),
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        day,
        isOtherMonth: false,
        isSelected: this._isSameDate(date, this._selectedDate),
        isToday: this._isToday(date),
        isDisabled: !this._isDateInRange(date),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(nextYear, nextMonth, day);
      days.push({
        date,
        day,
        isOtherMonth: true,
        isSelected: this._isSameDate(date, this._selectedDate),
        isToday: this._isToday(date),
        isDisabled: !this._isDateInRange(date),
      });
    }

    return days;
  }

  private _generateMonths(): Array<{
    month: number;
    name: string;
    isSelected: boolean;
    isDisabled: boolean;
  }> {
    const year = this._viewDate.getFullYear();
    const monthNames = this._getMonthNames();

    return monthNames.map((name, month) => ({
      month,
      name,
      isSelected: this._selectedDate
        ? this._selectedDate.getFullYear() === year && this._selectedDate.getMonth() === month
        : false,
      isDisabled: false, // Could add min/max year logic here
    }));
  }

  private _generateYears(): Array<{
    year: number;
    isSelected: boolean;
    isDisabled: boolean;
  }> {
    const currentYear = this._viewDate.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    const years = [];

    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      years.push({
        year,
        isSelected: this._selectedDate ? this._selectedDate.getFullYear() === year : false,
        isDisabled: false, // Could add min/max year logic here
      });
    }

    return years;
  }

  private _handleInputClick() {
    if (this.disabled || this.readonly) return;
    this._toggleCalendar();
  }

  private _handleInputInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this._inputValue = target.value;

    // Try to parse the input as a date
    const date = this._parseDate(this._inputValue);
    let newValue = '';

    if (date && !isNaN(date.getTime()) && this._isDateInRange(date)) {
      this._selectedDate = date;
      this._viewDate = new Date(date);
      newValue = this._getDateValue(date);
    }

    if (this.value !== newValue) {
      this.value = newValue;
      this._dispatchChange();
      this._dispatchInput();
    }
  }

  private _handleInputKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this._closeCalendar();
        break;
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        if (!this._open) {
          event.preventDefault();
          this._openCalendar();
        }
        break;
    }
  }

  private _handleDocumentClick(event: Event) {
    if (!this.contains(event.target as Node)) {
      this._closeCalendar();
    }
  }

  private _toggleCalendar() {
    if (this._open) {
      this._closeCalendar();
    } else {
      this._openCalendar();
    }
  }

  private _openCalendar() {
    if (this.disabled || this.readonly) return;

    this._open = true;
    this._currentView = 'days';

    if (this._selectedDate) {
      this._viewDate = new Date(this._selectedDate);
    }

    this.dispatchEvent(
      new CustomEvent('lith-open', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _closeCalendar() {
    this._open = false;

    this.dispatchEvent(
      new CustomEvent('lith-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handlePrevClick() {
    if (this._currentView === 'days') {
      this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() - 1, 1);
    } else if (this._currentView === 'months') {
      this._viewDate = new Date(this._viewDate.getFullYear() - 1, this._viewDate.getMonth(), 1);
    } else if (this._currentView === 'years') {
      this._viewDate = new Date(this._viewDate.getFullYear() - 10, this._viewDate.getMonth(), 1);
    }
  }

  private _handleNextClick() {
    if (this._currentView === 'days') {
      this._viewDate = new Date(this._viewDate.getFullYear(), this._viewDate.getMonth() + 1, 1);
    } else if (this._currentView === 'months') {
      this._viewDate = new Date(this._viewDate.getFullYear() + 1, this._viewDate.getMonth(), 1);
    } else if (this._currentView === 'years') {
      this._viewDate = new Date(this._viewDate.getFullYear() + 10, this._viewDate.getMonth(), 1);
    }
  }

  private _handleTitleClick() {
    if (this._currentView === 'days') {
      this._currentView = 'months';
    } else if (this._currentView === 'months') {
      this._currentView = 'years';
    }
  }

  private _handleDayClick(dayData: {
    date: Date;
    day: number;
    isOtherMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
    isDisabled: boolean;
  }) {
    if (dayData.isDisabled) return;

    this._selectedDate = dayData.date;
    this._viewDate = new Date(dayData.date);
    this.value = this._getDateValue(dayData.date);
    this._updateInputValue();

    this._dispatchChange();
    this._closeCalendar();
  }

  private _handleMonthClick(monthData: {
    month: number;
    name: string;
    isSelected: boolean;
    isDisabled: boolean;
  }) {
    this._viewDate = new Date(this._viewDate.getFullYear(), monthData.month, 1);
    this._currentView = 'days';
  }

  private _handleYearClick(yearData: { year: number; isSelected: boolean; isDisabled: boolean }) {
    this._viewDate = new Date(yearData.year, this._viewDate.getMonth(), 1);
    this._currentView = 'months';
  }

  private _dispatchChange() {
    const detail: DatePickerChangeDetail = {
      value: this.value,
      date: this._selectedDate,
      formattedValue: this._inputValue,
    };

    this.dispatchEvent(
      new CustomEvent('lith-change', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _dispatchInput() {
    const detail: DatePickerInputDetail = {
      value: this.value,
      inputValue: this._inputValue,
    };

    this.dispatchEvent(
      new CustomEvent('lith-input', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleFocus() {
    this.dispatchEvent(
      new FocusEvent('lith-focus', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleBlur() {
    this.dispatchEvent(
      new FocusEvent('lith-blur', {
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    const days = this._generateCalendarDays();
    const months = this._generateMonths();
    const years = this._generateYears();
    const weekdays = this._getWeekdayNames();

    return html`
      <div class="base" part="base">
        <div class="input-container">
          <input
            class="input"
            part="input"
            type="text"
            .value=${this._inputValue}
            placeholder=${ifDefined(this.placeholder || undefined)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            ?required=${this.required}
            name=${ifDefined(this.name || undefined)}
            autocomplete="off"
            @click=${this._handleInputClick}
            @input=${this._handleInputInput}
            @keydown=${this._handleInputKeyDown}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
          />
          <div class="icon" part="icon">
            <slot name="trigger-icon">📅</slot>
          </div>
        </div>

        <div class="calendar ${classMap({ open: this._open })}" part="calendar">
          <div class="header" part="header">
            <div class="navigation" part="navigation">
              <button
                class="nav-button"
                part="prev-button"
                type="button"
                @click=${this._handlePrevClick}
                aria-label="Previous ${this._currentView === 'days'
                  ? 'month'
                  : this._currentView === 'months'
                    ? 'year'
                    : 'decade'}"
              >
                <slot name="prev-button">‹</slot>
              </button>

              <button
                class="title"
                part="title"
                type="button"
                @click=${this._handleTitleClick}
                tabindex="0"
              >
                ${this._currentView === 'days'
                  ? `${this._getMonthName(this._viewDate.getMonth())} ${this._viewDate.getFullYear()}`
                  : this._currentView === 'months'
                    ? `${this._viewDate.getFullYear()}`
                    : `${Math.floor(this._viewDate.getFullYear() / 10) * 10}-${Math.floor(this._viewDate.getFullYear() / 10) * 10 + 9}`}
              </button>

              <button
                class="nav-button"
                part="next-button"
                type="button"
                @click=${this._handleNextClick}
                aria-label="Next ${this._currentView === 'days'
                  ? 'month'
                  : this._currentView === 'months'
                    ? 'year'
                    : 'decade'}"
              >
                <slot name="next-button">›</slot>
              </button>
            </div>
          </div>

          ${this._currentView === 'days'
            ? html`
                <div class="weekdays" part="weekdays">
                  ${weekdays.map(
                    (weekday) => html` <div class="weekday" part="weekday">${weekday}</div> `
                  )}
                </div>
                <div class="days" part="days">
                  ${days.map(
                    (dayData) => html`
                      <button
                        class="day ${classMap({
                          'other-month': dayData.isOtherMonth,
                          selected: dayData.isSelected,
                          today: dayData.isToday,
                        })}"
                        part="day day-button"
                        type="button"
                        ?disabled=${dayData.isDisabled}
                        @click=${() => this._handleDayClick(dayData)}
                        aria-label="${dayData.date.toDateString()}"
                      >
                        ${dayData.day}
                      </button>
                    `
                  )}
                </div>
              `
            : this._currentView === 'months'
              ? html`
                  <div class="months" part="months">
                    ${months.map(
                      (monthData) => html`
                        <button
                          class="month ${classMap({
                            selected: monthData.isSelected,
                          })}"
                          part="month month-button"
                          type="button"
                          ?disabled=${monthData.isDisabled}
                          @click=${() => this._handleMonthClick(monthData)}
                        >
                          ${monthData.name}
                        </button>
                      `
                    )}
                  </div>
                `
              : html`
                  <div class="years" part="years">
                    ${years.map(
                      (yearData) => html`
                        <button
                          class="year ${classMap({
                            selected: yearData.isSelected,
                          })}"
                          part="year year-button"
                          type="button"
                          ?disabled=${yearData.isDisabled}
                          @click=${() => this._handleYearClick(yearData)}
                        >
                          ${yearData.year}
                        </button>
                      `
                    )}
                  </div>
                `}
        </div>
      </div>
    `;
  }

  // Form controls
  checkValidity(): boolean {
    if (!this._internals) return true;
    return this._internals.checkValidity();
  }

  reportValidity(): boolean {
    if (!this._internals) return true;
    return this._internals.reportValidity();
  }

  setCustomValidity(message: string): void {
    if (
      !this._internals ||
      typeof (
        this._internals as ElementInternals & { setCustomValidity?: (message: string) => void }
      ).setCustomValidity !== 'function'
    )
      return;
    (
      this._internals as ElementInternals & { setCustomValidity: (message: string) => void }
    ).setCustomValidity(message);
  }

  get form(): HTMLFormElement | null {
    return this._internals?.form ?? null;
  }

  get validity(): ValidityState | undefined {
    return this._internals?.validity;
  }

  get validationMessage(): string {
    return this._internals?.validationMessage ?? '';
  }

  get willValidate(): boolean {
    return this._internals?.willValidate ?? false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lith-date-picker': LithDatePicker;
  }
}
