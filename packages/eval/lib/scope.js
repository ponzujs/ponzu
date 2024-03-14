class Scope {
  constructor(source = undefined, parent = undefined) {
    this.parent = parent;
    this.vars = {};
    this.source = source;
    if (source) {
      Object.keys(source).forEach((key) => {
        this.declare(key);
        this.set(key, source[key]);
      });
    }
  }

  declare(name, constant = false) {
    if (this.vars[name]) {
      throw new Error(`Variable ${name} is already declared`);
    }
    this.vars[name] = {
      constant,
      value: undefined,
    };
  }

  get(name) {
    return this.vars[name]?.value ?? this.parent?.get(name);
  }

  set(name, value, isDeclaration = false) {
    if (this.vars[name]) {
      if (this.vars[name].constant && !isDeclaration) {
        throw new Error(`Cannot assign to constant variable ${name}`);
      }
      this.vars[name].value = value;
      return value;
    }
    if (this.parent) {
      return this.parent.set(name, value);
    }
    throw new Error(`Variable ${name} is not defined`);
  }

  has(name) {
    return this.vars[name] || this.parent?.has(name);
  }

  remove(name) {
    if (this.vars[name]) {
      delete this.vars[name];
      return;
    }
    if (this.parent) {
      this.parent.remove(name);
      return;
    }
    throw new Error(`Variable ${name} is not defined`);
  }

  writeSource() {
    if (this.source) {
      Object.keys(this.vars).forEach((key) => {
        this.source[key] = this.vars[key].value;
      });
      Object.keys(this.source).forEach((key) => {
        if (!this.vars[key]) {
          delete this.source[key];
        }
      });
    }
  }
}

module.exports = { Scope };
