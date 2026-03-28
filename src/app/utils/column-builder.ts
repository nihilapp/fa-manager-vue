export class ColumnBuilder<T = any> {
  private column: DataTableColumn<T>;

  constructor(key: keyof T | (string & {}), label: string) {
    this.column = { key, label, };
  }

  static column<T = any>(key: keyof T | (string & {}), label: string) {
    return new ColumnBuilder<T>(key, label);
  }

  center() {
    this.column.align = 'justify-center';
    return this;
  }

  start() {
    this.column.align = 'justify-start';
    return this;
  }

  end() {
    this.column.align = 'justify-end';
    return this;
  }

  slot(name: string) {
    this.column.slotName = name;
    return this;
  }

  width(value: string | number) {
    this.column.width = value;
    return this;
  }

  cellStyle(classes: string) {
    this.column.cellStyle = classes;
    return this;
  }

  headerStyle(classes: string) {
    this.column.headerStyle = classes;
    return this;
  }

  icon(name: IconName) {
    this.column.icon = name;
    return this;
  }

  iconStyle(classes: string) {
    this.column.iconStyle = classes;
    return this;
  }

  sortable() {
    this.column.sortable = true;
    return this;
  }

  filterable() {
    this.column.filterable = true;
    return this;
  }

  build() {
    return this.column;
  }
}
