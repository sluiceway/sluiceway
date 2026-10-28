#!/usr/bin/env node
import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  if (mod && typeof mod === "object" || typeof mod === "function") {
    for (let key of __getOwnPropNames(mod))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: __accessProp.bind(mod, key),
          enumerable: true
        });
  }
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS(function(exports) {
  var ALIAS = Symbol.for("yaml.alias");
  var DOC = Symbol.for("yaml.document");
  var MAP = Symbol.for("yaml.map");
  var PAIR = Symbol.for("yaml.pair");
  var SCALAR = Symbol.for("yaml.scalar");
  var SEQ = Symbol.for("yaml.seq");
  var NODE_TYPE = Symbol.for("yaml.node.type");
  var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
  var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
  var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
  var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
  var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
  var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
  function isCollection(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case MAP:
        case SEQ:
          return true;
      }
    return false;
  }
  function isNode(node) {
    if (node && typeof node === "object")
      switch (node[NODE_TYPE]) {
        case ALIAS:
        case MAP:
        case SCALAR:
        case SEQ:
          return true;
      }
    return false;
  }
  var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
  exports.ALIAS = ALIAS;
  exports.DOC = DOC;
  exports.MAP = MAP;
  exports.NODE_TYPE = NODE_TYPE;
  exports.PAIR = PAIR;
  exports.SCALAR = SCALAR;
  exports.SEQ = SEQ;
  exports.hasAnchor = hasAnchor;
  exports.isAlias = isAlias;
  exports.isCollection = isCollection;
  exports.isDocument = isDocument;
  exports.isMap = isMap;
  exports.isNode = isNode;
  exports.isPair = isPair;
  exports.isScalar = isScalar;
  exports.isSeq = isSeq;
});

// node_modules/yaml/dist/visit.js
var require_visit = __commonJS(function(exports) {
  var identity = require_identity();
  var BREAK = Symbol("break visit");
  var SKIP = Symbol("skip children");
  var REMOVE = Symbol("remove node");
  function visit(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (identity.isDocument(node)) {
      const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
      if (cd === REMOVE)
        node.contents = null;
    } else
      visit_(null, node, visitor_, Object.freeze([]));
  }
  visit.BREAK = BREAK;
  visit.SKIP = SKIP;
  visit.REMOVE = REMOVE;
  function visit_(key, node, visitor, path) {
    const ctrl = callVisitor(key, node, visitor, path);
    if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
      replaceNode(key, path, ctrl);
      return visit_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== "symbol") {
      if (identity.isCollection(node)) {
        path = Object.freeze(path.concat(node));
        for (let i = 0;i < node.items.length; ++i) {
          const ci = visit_(i, node.items[i], visitor, path);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (identity.isPair(node)) {
        path = Object.freeze(path.concat(node));
        const ck = visit_("key", node.key, visitor, path);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        const cv = visit_("value", node.value, visitor, path);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  async function visitAsync(node, visitor) {
    const visitor_ = initVisitor(visitor);
    if (identity.isDocument(node)) {
      const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
      if (cd === REMOVE)
        node.contents = null;
    } else
      await visitAsync_(null, node, visitor_, Object.freeze([]));
  }
  visitAsync.BREAK = BREAK;
  visitAsync.SKIP = SKIP;
  visitAsync.REMOVE = REMOVE;
  async function visitAsync_(key, node, visitor, path) {
    const ctrl = await callVisitor(key, node, visitor, path);
    if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
      replaceNode(key, path, ctrl);
      return visitAsync_(key, ctrl, visitor, path);
    }
    if (typeof ctrl !== "symbol") {
      if (identity.isCollection(node)) {
        path = Object.freeze(path.concat(node));
        for (let i = 0;i < node.items.length; ++i) {
          const ci = await visitAsync_(i, node.items[i], visitor, path);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            node.items.splice(i, 1);
            i -= 1;
          }
        }
      } else if (identity.isPair(node)) {
        path = Object.freeze(path.concat(node));
        const ck = await visitAsync_("key", node.key, visitor, path);
        if (ck === BREAK)
          return BREAK;
        else if (ck === REMOVE)
          node.key = null;
        const cv = await visitAsync_("value", node.value, visitor, path);
        if (cv === BREAK)
          return BREAK;
        else if (cv === REMOVE)
          node.value = null;
      }
    }
    return ctrl;
  }
  function initVisitor(visitor) {
    if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
      return Object.assign({
        Alias: visitor.Node,
        Map: visitor.Node,
        Scalar: visitor.Node,
        Seq: visitor.Node
      }, visitor.Value && {
        Map: visitor.Value,
        Scalar: visitor.Value,
        Seq: visitor.Value
      }, visitor.Collection && {
        Map: visitor.Collection,
        Seq: visitor.Collection
      }, visitor);
    }
    return visitor;
  }
  function callVisitor(key, node, visitor, path) {
    if (typeof visitor === "function")
      return visitor(key, node, path);
    if (identity.isMap(node))
      return visitor.Map?.(key, node, path);
    if (identity.isSeq(node))
      return visitor.Seq?.(key, node, path);
    if (identity.isPair(node))
      return visitor.Pair?.(key, node, path);
    if (identity.isScalar(node))
      return visitor.Scalar?.(key, node, path);
    if (identity.isAlias(node))
      return visitor.Alias?.(key, node, path);
    return;
  }
  function replaceNode(key, path, node) {
    const parent = path[path.length - 1];
    if (identity.isCollection(parent)) {
      parent.items[key] = node;
    } else if (identity.isPair(parent)) {
      if (key === "key")
        parent.key = node;
      else
        parent.value = node;
    } else if (identity.isDocument(parent)) {
      parent.contents = node;
    } else {
      const pt = identity.isAlias(parent) ? "alias" : "scalar";
      throw new Error(`Cannot replace node with ${pt} parent`);
    }
  }
  exports.visit = visit;
  exports.visitAsync = visitAsync;
});

// node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS(function(exports) {
  var identity = require_identity();
  var visit = require_visit();
  var escapeChars = {
    "!": "%21",
    ",": "%2C",
    "[": "%5B",
    "]": "%5D",
    "{": "%7B",
    "}": "%7D"
  };
  var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);

  class Directives {
    constructor(yaml, tags) {
      this.docStart = null;
      this.docEnd = false;
      this.yaml = Object.assign({}, Directives.defaultYaml, yaml);
      this.tags = Object.assign({}, Directives.defaultTags, tags);
    }
    clone() {
      const copy = new Directives(this.yaml, this.tags);
      copy.docStart = this.docStart;
      return copy;
    }
    atDocument() {
      const res = new Directives(this.yaml, this.tags);
      switch (this.yaml.version) {
        case "1.1":
          this.atNextDocument = true;
          break;
        case "1.2":
          this.atNextDocument = false;
          this.yaml = {
            explicit: Directives.defaultYaml.explicit,
            version: "1.2"
          };
          this.tags = Object.assign({}, Directives.defaultTags);
          break;
      }
      return res;
    }
    add(line, onError) {
      if (this.atNextDocument) {
        this.yaml = { explicit: Directives.defaultYaml.explicit, version: "1.1" };
        this.tags = Object.assign({}, Directives.defaultTags);
        this.atNextDocument = false;
      }
      const parts = line.trim().split(/[ \t]+/);
      const name = parts.shift();
      switch (name) {
        case "%TAG": {
          if (parts.length !== 2) {
            onError(0, "%TAG directive should contain exactly two parts");
            if (parts.length < 2)
              return false;
          }
          const [handle, prefix] = parts;
          this.tags[handle] = prefix;
          return true;
        }
        case "%YAML": {
          this.yaml.explicit = true;
          if (parts.length !== 1) {
            onError(0, "%YAML directive should contain exactly one part");
            return false;
          }
          const [version] = parts;
          if (version === "1.1" || version === "1.2") {
            this.yaml.version = version;
            return true;
          } else {
            const isValid = /^\d+\.\d+$/.test(version);
            onError(6, `Unsupported YAML version ${version}`, isValid);
            return false;
          }
        }
        default:
          onError(0, `Unknown directive ${name}`, true);
          return false;
      }
    }
    tagName(source, onError) {
      if (source === "!")
        return "!";
      if (source[0] !== "!") {
        onError(`Not a valid tag: ${source}`);
        return null;
      }
      if (source[1] === "<") {
        const verbatim = source.slice(2, -1);
        if (verbatim === "!" || verbatim === "!!") {
          onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
          return null;
        }
        if (source[source.length - 1] !== ">")
          onError("Verbatim tags must end with a >");
        return verbatim;
      }
      const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
      if (!suffix)
        onError(`The ${source} tag has no suffix`);
      const prefix = this.tags[handle];
      if (prefix) {
        try {
          return prefix + decodeURIComponent(suffix);
        } catch (error) {
          onError(String(error));
          return null;
        }
      }
      if (handle === "!")
        return source;
      onError(`Could not resolve tag: ${source}`);
      return null;
    }
    tagString(tag) {
      for (const [handle, prefix] of Object.entries(this.tags)) {
        if (tag.startsWith(prefix))
          return handle + escapeTagName(tag.substring(prefix.length));
      }
      return tag[0] === "!" ? tag : `!<${tag}>`;
    }
    toString(doc) {
      const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
      const tagEntries = Object.entries(this.tags);
      let tagNames;
      if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
        const tags = {};
        visit.visit(doc.contents, (_key, node) => {
          if (identity.isNode(node) && node.tag)
            tags[node.tag] = true;
        });
        tagNames = Object.keys(tags);
      } else
        tagNames = [];
      for (const [handle, prefix] of tagEntries) {
        if (handle === "!!" && prefix === "tag:yaml.org,2002:")
          continue;
        if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
          lines.push(`%TAG ${handle} ${prefix}`);
      }
      return lines.join(`
`);
    }
  }
  Directives.defaultYaml = { explicit: false, version: "1.2" };
  Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
  exports.Directives = Directives;
});

// node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS(function(exports) {
  var identity = require_identity();
  var visit = require_visit();
  function anchorIsValid(anchor) {
    if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
      const sa = JSON.stringify(anchor);
      const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
      throw new Error(msg);
    }
    return true;
  }
  function anchorNames(root) {
    const anchors = new Set;
    visit.visit(root, {
      Value(_key, node) {
        if (node.anchor)
          anchors.add(node.anchor);
      }
    });
    return anchors;
  }
  function findNewAnchor(prefix, exclude) {
    for (let i = 1;; ++i) {
      const name = `${prefix}${i}`;
      if (!exclude.has(name))
        return name;
    }
  }
  function createNodeAnchors(doc, prefix) {
    const aliasObjects = [];
    const sourceObjects = new Map;
    let prevAnchors = null;
    return {
      onAnchor: (source) => {
        aliasObjects.push(source);
        prevAnchors ?? (prevAnchors = anchorNames(doc));
        const anchor = findNewAnchor(prefix, prevAnchors);
        prevAnchors.add(anchor);
        return anchor;
      },
      setAnchors: () => {
        for (const source of aliasObjects) {
          const ref = sourceObjects.get(source);
          if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
            ref.node.anchor = ref.anchor;
          } else {
            const error = new Error("Failed to resolve repeated object (this should not happen)");
            error.source = source;
            throw error;
          }
        }
      },
      sourceObjects
    };
  }
  exports.anchorIsValid = anchorIsValid;
  exports.anchorNames = anchorNames;
  exports.createNodeAnchors = createNodeAnchors;
  exports.findNewAnchor = findNewAnchor;
});

// node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS(function(exports) {
  function applyReviver(reviver, obj, key, val) {
    if (val && typeof val === "object") {
      if (Array.isArray(val)) {
        for (let i = 0, len = val.length;i < len; ++i) {
          const v0 = val[i];
          const v1 = applyReviver(reviver, val, String(i), v0);
          if (v1 === undefined)
            delete val[i];
          else if (v1 !== v0)
            val[i] = v1;
        }
      } else if (val instanceof Map) {
        for (const k of Array.from(val.keys())) {
          const v0 = val.get(k);
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === undefined)
            val.delete(k);
          else if (v1 !== v0)
            val.set(k, v1);
        }
      } else if (val instanceof Set) {
        for (const v0 of Array.from(val)) {
          const v1 = applyReviver(reviver, val, v0, v0);
          if (v1 === undefined)
            val.delete(v0);
          else if (v1 !== v0) {
            val.delete(v0);
            val.add(v1);
          }
        }
      } else {
        for (const [k, v0] of Object.entries(val)) {
          const v1 = applyReviver(reviver, val, k, v0);
          if (v1 === undefined)
            delete val[k];
          else if (v1 !== v0)
            val[k] = v1;
        }
      }
    }
    return reviver.call(obj, key, val);
  }
  exports.applyReviver = applyReviver;
});

// node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS(function(exports) {
  var identity = require_identity();
  function toJS(value, arg, ctx) {
    if (Array.isArray(value))
      return value.map((v, i) => toJS(v, String(i), ctx));
    if (value && typeof value.toJSON === "function") {
      if (!ctx || !identity.hasAnchor(value))
        return value.toJSON(arg, ctx);
      const data = { aliasCount: 0, count: 1, res: undefined };
      ctx.anchors.set(value, data);
      ctx.onCreate = (res) => {
        data.res = res;
        delete ctx.onCreate;
      };
      const res = value.toJSON(arg, ctx);
      if (ctx.onCreate)
        ctx.onCreate(res);
      return res;
    }
    if (typeof value === "bigint" && !ctx?.keep)
      return Number(value);
    return value;
  }
  exports.toJS = toJS;
});

// node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS(function(exports) {
  var applyReviver = require_applyReviver();
  var identity = require_identity();
  var toJS = require_toJS();

  class NodeBase {
    constructor(type) {
      Object.defineProperty(this, identity.NODE_TYPE, { value: type });
    }
    clone() {
      const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
      if (!identity.isDocument(doc))
        throw new TypeError("A document argument is required");
      const ctx = {
        anchors: new Map,
        doc,
        keep: true,
        mapAsMap: mapAsMap === true,
        mapKeyWarned: false,
        maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
      };
      const res = toJS.toJS(this, "", ctx);
      if (typeof onAnchor === "function")
        for (const { count, res } of ctx.anchors.values())
          onAnchor(res, count);
      return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
    }
  }
  exports.NodeBase = NodeBase;
});

// node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS(function(exports) {
  var anchors = require_anchors();
  var visit = require_visit();
  var identity = require_identity();
  var Node = require_Node();
  var toJS = require_toJS();

  class Alias extends Node.NodeBase {
    constructor(source) {
      super(identity.ALIAS);
      this.source = source;
      Object.defineProperty(this, "tag", {
        set() {
          throw new Error("Alias nodes cannot have tags");
        }
      });
    }
    resolve(doc, ctx) {
      if (ctx?.maxAliasCount === 0)
        throw new ReferenceError("Alias resolution is disabled");
      let nodes;
      if (ctx?.aliasResolveCache) {
        nodes = ctx.aliasResolveCache;
      } else {
        nodes = [];
        visit.visit(doc, {
          Node: (_key, node) => {
            if (identity.isAlias(node) || identity.hasAnchor(node))
              nodes.push(node);
          }
        });
        if (ctx)
          ctx.aliasResolveCache = nodes;
      }
      let found = undefined;
      for (const node of nodes) {
        if (node === this)
          break;
        if (node.anchor === this.source)
          found = node;
      }
      if (found && ctx) {
        const { anchors, doc, maxAliasCount } = ctx;
        let data = anchors.get(found);
        if (!data) {
          toJS.toJS(found, null, ctx);
          data = anchors.get(found);
        }
        if (data?.res === undefined) {
          const msg = "This should not happen: Alias anchor was not resolved?";
          throw new ReferenceError(msg);
        }
        if (maxAliasCount >= 0) {
          data.count += 1;
          if (data.aliasCount === 0)
            data.aliasCount = getAliasCount(doc, found, anchors);
          if (data.count * data.aliasCount > maxAliasCount) {
            const msg = "Excessive alias count indicates a resource exhaustion attack";
            throw new ReferenceError(msg);
          }
        }
      }
      return found;
    }
    toJSON(_arg, ctx) {
      if (!ctx)
        return { source: this.source };
      const source = this.resolve(ctx.doc, ctx);
      if (!source) {
        const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new ReferenceError(msg);
      }
      return ctx.anchors.get(source).res;
    }
    toString(ctx, _onComment, _onChompKeep) {
      const src = `*${this.source}`;
      if (ctx) {
        anchors.anchorIsValid(this.source);
        if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new Error(msg);
        }
        if (ctx.implicitKey)
          return `${src} `;
      }
      return src;
    }
  }
  function getAliasCount(doc, node, anchors) {
    if (identity.isAlias(node)) {
      const source = node.resolve(doc);
      const anchor = anchors && source && anchors.get(source);
      return anchor ? anchor.count * anchor.aliasCount : 0;
    } else if (identity.isCollection(node)) {
      let count = 0;
      for (const item of node.items) {
        const c = getAliasCount(doc, item, anchors);
        if (c > count)
          count = c;
      }
      return count;
    } else if (identity.isPair(node)) {
      const kc = getAliasCount(doc, node.key, anchors);
      const vc = getAliasCount(doc, node.value, anchors);
      return Math.max(kc, vc);
    }
    return 1;
  }
  exports.Alias = Alias;
});

// node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS(function(exports) {
  var identity = require_identity();
  var Node = require_Node();
  var toJS = require_toJS();
  var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";

  class Scalar extends Node.NodeBase {
    constructor(value) {
      super(identity.SCALAR);
      this.value = value;
    }
    toJSON(arg, ctx) {
      return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
    }
    toString() {
      return String(this.value);
    }
  }
  Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
  Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
  Scalar.PLAIN = "PLAIN";
  Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
  Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
  exports.Scalar = Scalar;
  exports.isScalarValue = isScalarValue;
});

// node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS(function(exports) {
  var Alias = require_Alias();
  var identity = require_identity();
  var Scalar = require_Scalar();
  var defaultTagPrefix = "tag:yaml.org,2002:";
  function findTagObject(value, tagName, tags) {
    if (tagName) {
      const match = tags.filter((t) => t.tag === tagName);
      const tagObj = match.find((t) => !t.format) ?? match[0];
      if (!tagObj)
        throw new Error(`Tag ${tagName} not found`);
      return tagObj;
    }
    return tags.find((t) => t.identify?.(value) && !t.format);
  }
  function createNode(value, tagName, ctx) {
    if (identity.isDocument(value))
      value = value.contents;
    if (identity.isNode(value))
      return value;
    if (identity.isPair(value)) {
      const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
      map.items.push(value);
      return map;
    }
    if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
      value = value.valueOf();
    }
    const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
    let ref = undefined;
    if (aliasDuplicateObjects && value && typeof value === "object") {
      ref = sourceObjects.get(value);
      if (ref) {
        ref.anchor ?? (ref.anchor = onAnchor(value));
        return new Alias.Alias(ref.anchor);
      } else {
        ref = { anchor: null, node: null };
        sourceObjects.set(value, ref);
      }
    }
    if (tagName?.startsWith("!!"))
      tagName = defaultTagPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema.tags);
    if (!tagObj) {
      if (value && typeof value.toJSON === "function") {
        value = value.toJSON();
      }
      if (!value || typeof value !== "object") {
        const node = new Scalar.Scalar(value);
        if (ref)
          ref.node = node;
        return node;
      }
      tagObj = value instanceof Map ? schema[identity.MAP] : (Symbol.iterator in Object(value)) ? schema[identity.SEQ] : schema[identity.MAP];
    }
    if (onTagObj) {
      onTagObj(tagObj);
      delete ctx.onTagObj;
    }
    const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
    if (tagName)
      node.tag = tagName;
    else if (!tagObj.default)
      node.tag = tagObj.tag;
    if (ref)
      ref.node = node;
    return node;
  }
  exports.createNode = createNode;
});

// node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS(function(exports) {
  var createNode = require_createNode();
  var identity = require_identity();
  var Node = require_Node();
  function collectionFromPath(schema, path, value) {
    let v = value;
    for (let i = path.length - 1;i >= 0; --i) {
      const k = path[i];
      if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
        const a = [];
        a[k] = v;
        v = a;
      } else {
        v = new Map([[k, v]]);
      }
    }
    return createNode.createNode(v, undefined, {
      aliasDuplicateObjects: false,
      keepUndefined: false,
      onAnchor: () => {
        throw new Error("This should not happen, please report a bug.");
      },
      schema,
      sourceObjects: new Map
    });
  }
  var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;

  class Collection extends Node.NodeBase {
    constructor(type, schema) {
      super(type);
      Object.defineProperty(this, "schema", {
        value: schema,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }
    clone(schema) {
      const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
      if (schema)
        copy.schema = schema;
      copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    addIn(path, value) {
      if (isEmptyPath(path))
        this.add(value);
      else {
        const [key, ...rest] = path;
        const node = this.get(key, true);
        if (identity.isCollection(node))
          node.addIn(rest, value);
        else if (node === undefined && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
    deleteIn(path) {
      const [key, ...rest] = path;
      if (rest.length === 0)
        return this.delete(key);
      const node = this.get(key, true);
      if (identity.isCollection(node))
        return node.deleteIn(rest);
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
    getIn(path, keepScalar) {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (rest.length === 0)
        return !keepScalar && identity.isScalar(node) ? node.value : node;
      else
        return identity.isCollection(node) ? node.getIn(rest, keepScalar) : undefined;
    }
    hasAllNullValues(allowScalar) {
      return this.items.every((node) => {
        if (!identity.isPair(node))
          return false;
        const n = node.value;
        return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
      });
    }
    hasIn(path) {
      const [key, ...rest] = path;
      if (rest.length === 0)
        return this.has(key);
      const node = this.get(key, true);
      return identity.isCollection(node) ? node.hasIn(rest) : false;
    }
    setIn(path, value) {
      const [key, ...rest] = path;
      if (rest.length === 0) {
        this.set(key, value);
      } else {
        const node = this.get(key, true);
        if (identity.isCollection(node))
          node.setIn(rest, value);
        else if (node === undefined && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
  }
  exports.Collection = Collection;
  exports.collectionFromPath = collectionFromPath;
  exports.isEmptyPath = isEmptyPath;
});

// node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS(function(exports) {
  var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
  function indentComment(comment, indent) {
    if (/^\n+$/.test(comment))
      return comment.substring(1);
    return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
  }
  var lineComment = (str, indent, comment) => str.endsWith(`
`) ? indentComment(comment, indent) : comment.includes(`
`) ? `
` + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
  exports.indentComment = indentComment;
  exports.lineComment = lineComment;
  exports.stringifyComment = stringifyComment;
});

// node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS(function(exports) {
  var FOLD_FLOW = "flow";
  var FOLD_BLOCK = "block";
  var FOLD_QUOTED = "quoted";
  function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
    if (!lineWidth || lineWidth < 0)
      return text;
    if (lineWidth < minContentWidth)
      minContentWidth = 0;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep)
      return text;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent.length;
    if (typeof indentAtStart === "number") {
      if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
        folds.push(0);
      else
        end = lineWidth - indentAtStart;
    }
    let split = undefined;
    let prev = undefined;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;
    if (mode === FOLD_BLOCK) {
      i = consumeMoreIndentedLines(text, i, indent.length);
      if (i !== -1)
        end = i + endStep;
    }
    for (let ch;ch = text[i += 1]; ) {
      if (mode === FOLD_QUOTED && ch === "\\") {
        escStart = i;
        switch (text[i + 1]) {
          case "x":
            i += 3;
            break;
          case "u":
            i += 5;
            break;
          case "U":
            i += 9;
            break;
          default:
            i += 1;
        }
        escEnd = i;
      }
      if (ch === `
`) {
        if (mode === FOLD_BLOCK)
          i = consumeMoreIndentedLines(text, i, indent.length);
        end = i + indent.length + endStep;
        split = undefined;
      } else {
        if (ch === " " && prev && prev !== " " && prev !== `
` && prev !== "\t") {
          const next = text[i + 1];
          if (next && next !== " " && next !== `
` && next !== "\t")
            split = i;
        }
        if (i >= end) {
          if (split) {
            folds.push(split);
            end = split + endStep;
            split = undefined;
          } else if (mode === FOLD_QUOTED) {
            while (prev === " " || prev === "\t") {
              prev = ch;
              ch = text[i += 1];
              overflow = true;
            }
            const j = i > escEnd + 1 ? i - 2 : escStart - 1;
            if (escapedFolds[j])
              return text;
            folds.push(j);
            escapedFolds[j] = true;
            end = j + endStep;
            split = undefined;
          } else {
            overflow = true;
          }
        }
      }
      prev = ch;
    }
    if (overflow && onOverflow)
      onOverflow();
    if (folds.length === 0)
      return text;
    if (onFold)
      onFold();
    let res = text.slice(0, folds[0]);
    for (let i = 0;i < folds.length; ++i) {
      const fold = folds[i];
      const end = folds[i + 1] || text.length;
      if (fold === 0)
        res = `
${indent}${text.slice(0, end)}`;
      else {
        if (mode === FOLD_QUOTED && escapedFolds[fold])
          res += `${text[fold]}\\`;
        res += `
${indent}${text.slice(fold + 1, end)}`;
      }
    }
    return res;
  }
  function consumeMoreIndentedLines(text, i, indent) {
    let end = i;
    let start = i + 1;
    let ch = text[start];
    while (ch === " " || ch === "\t") {
      if (i < start + indent) {
        ch = text[++i];
      } else {
        do {
          ch = text[++i];
        } while (ch && ch !== `
`);
        end = i;
        start = i + 1;
        ch = text[start];
      }
    }
    return end;
  }
  exports.FOLD_BLOCK = FOLD_BLOCK;
  exports.FOLD_FLOW = FOLD_FLOW;
  exports.FOLD_QUOTED = FOLD_QUOTED;
  exports.foldFlowLines = foldFlowLines;
});

// node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS(function(exports) {
  var Scalar = require_Scalar();
  var foldFlowLines = require_foldFlowLines();
  var getFoldOptions = (ctx, isBlock) => ({
    indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
    lineWidth: ctx.options.lineWidth,
    minContentWidth: ctx.options.minContentWidth
  });
  var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
  function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0)
      return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit)
      return false;
    for (let i = 0, start = 0;i < strLen; ++i) {
      if (str[i] === `
`) {
        if (i - start > limit)
          return true;
        start = i + 1;
        if (strLen - start <= limit)
          return false;
      }
    }
    return true;
  }
  function doubleQuotedString(value, ctx) {
    const json = JSON.stringify(value);
    if (ctx.options.doubleQuotedAsJSON)
      return json;
    const { implicitKey } = ctx;
    const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    let str = "";
    let start = 0;
    for (let i = 0, ch = json[i];ch; ch = json[++i]) {
      if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
        str += json.slice(start, i) + "\\ ";
        i += 1;
        start = i;
        ch = "\\";
      }
      if (ch === "\\")
        switch (json[i + 1]) {
          case "u":
            {
              str += json.slice(start, i);
              const code = json.substr(i + 2, 4);
              switch (code) {
                case "0000":
                  str += "\\0";
                  break;
                case "0007":
                  str += "\\a";
                  break;
                case "000b":
                  str += "\\v";
                  break;
                case "001b":
                  str += "\\e";
                  break;
                case "0085":
                  str += "\\N";
                  break;
                case "00a0":
                  str += "\\_";
                  break;
                case "2028":
                  str += "\\L";
                  break;
                case "2029":
                  str += "\\P";
                  break;
                default:
                  if (code.substr(0, 2) === "00")
                    str += "\\x" + code.substr(2);
                  else
                    str += json.substr(i, 6);
              }
              i += 5;
              start = i + 1;
            }
            break;
          case "n":
            if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
              i += 1;
            } else {
              str += json.slice(start, i) + `

`;
              while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                str += `
`;
                i += 2;
              }
              str += indent;
              if (json[i + 2] === " ")
                str += "\\";
              i += 1;
              start = i + 1;
            }
            break;
          default:
            i += 1;
        }
    }
    str = start ? str + json.slice(start) : json;
    return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
  }
  function singleQuotedString(value, ctx) {
    if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes(`
`) || /[ \t]\n|\n[ \t]/.test(value))
      return doubleQuotedString(value, ctx);
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
    return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
  }
  function quotedString(value, ctx) {
    const { singleQuote } = ctx.options;
    let qs;
    if (singleQuote === false)
      qs = doubleQuotedString;
    else {
      const hasDouble = value.includes('"');
      const hasSingle = value.includes("'");
      if (hasDouble && !hasSingle)
        qs = singleQuotedString;
      else if (hasSingle && !hasDouble)
        qs = doubleQuotedString;
      else
        qs = singleQuote ? singleQuotedString : doubleQuotedString;
    }
    return qs(value, ctx);
  }
  var blockEndNewlines;
  try {
    blockEndNewlines = new RegExp(`(^|(?<!
))
+(?!
|$)`, "g");
  } catch {
    blockEndNewlines = /\n+(?!\n|$)/g;
  }
  function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
    const { blockQuote, commentString, lineWidth } = ctx.options;
    if (!blockQuote || /\n[\t ]+$/.test(value)) {
      return quotedString(value, ctx);
    }
    const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
    const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
    if (!value)
      return literal ? `|
` : `>
`;
    let chomp;
    let endStart;
    for (endStart = value.length;endStart > 0; --endStart) {
      const ch = value[endStart - 1];
      if (ch !== `
` && ch !== "\t" && ch !== " ")
        break;
    }
    let end = value.substring(endStart);
    const endNlPos = end.indexOf(`
`);
    if (endNlPos === -1) {
      chomp = "-";
    } else if (value === end || endNlPos !== end.length - 1) {
      chomp = "+";
      if (onChompKeep)
        onChompKeep();
    } else {
      chomp = "";
    }
    if (end) {
      value = value.slice(0, -end.length);
      if (end[end.length - 1] === `
`)
        end = end.slice(0, -1);
      end = end.replace(blockEndNewlines, `$&${indent}`);
    }
    let startWithSpace = false;
    let startEnd;
    let startNlPos = -1;
    for (startEnd = 0;startEnd < value.length; ++startEnd) {
      const ch = value[startEnd];
      if (ch === " ")
        startWithSpace = true;
      else if (ch === `
`)
        startNlPos = startEnd;
      else
        break;
    }
    let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
    if (start) {
      value = value.substring(start.length);
      start = start.replace(/\n+/g, `$&${indent}`);
    }
    const indentSize = indent ? "2" : "1";
    let header = (startWithSpace ? indentSize : "") + chomp;
    if (comment) {
      header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
      if (onComment)
        onComment();
    }
    if (!literal) {
      const foldedValue = value.replace(/\n+/g, `
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
      let literalFallback = false;
      const foldOptions = getFoldOptions(ctx, true);
      if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
        foldOptions.onOverflow = () => {
          literalFallback = true;
        };
      }
      const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
      if (!literalFallback)
        return `>${header}
${indent}${body}`;
    }
    value = value.replace(/\n+/g, `$&${indent}`);
    return `|${header}
${indent}${start}${value}${end}`;
  }
  function plainString(item, ctx, onComment, onChompKeep) {
    const { type, value } = item;
    const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
    if (implicitKey && value.includes(`
`) || inFlow && /[[\]{},]/.test(value)) {
      return quotedString(value, ctx);
    }
    if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
      return implicitKey || inFlow || !value.includes(`
`) ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
    }
    if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes(`
`)) {
      return blockString(item, ctx, onComment, onChompKeep);
    }
    if (containsDocumentMarker(value)) {
      if (indent === "") {
        ctx.forceBlockIndent = true;
        return blockString(item, ctx, onComment, onChompKeep);
      } else if (implicitKey && indent === indentStep) {
        return quotedString(value, ctx);
      }
    }
    const str = value.replace(/\n+/g, `$&
${indent}`);
    if (actualString) {
      const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
      const { compat, tags } = ctx.doc.schema;
      if (tags.some(test) || compat?.some(test))
        return quotedString(value, ctx);
    }
    return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
  }
  function stringifyString(item, ctx, onComment, onChompKeep) {
    const { implicitKey, inFlow } = ctx;
    const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
    let { type } = item;
    if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
      if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
        type = Scalar.Scalar.QUOTE_DOUBLE;
    }
    const _stringify = (_type) => {
      switch (_type) {
        case Scalar.Scalar.BLOCK_FOLDED:
        case Scalar.Scalar.BLOCK_LITERAL:
          return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
        case Scalar.Scalar.QUOTE_DOUBLE:
          return doubleQuotedString(ss.value, ctx);
        case Scalar.Scalar.QUOTE_SINGLE:
          return singleQuotedString(ss.value, ctx);
        case Scalar.Scalar.PLAIN:
          return plainString(ss, ctx, onComment, onChompKeep);
        default:
          return null;
      }
    };
    let res = _stringify(type);
    if (res === null) {
      const { defaultKeyType, defaultStringType } = ctx.options;
      const t = implicitKey && defaultKeyType || defaultStringType;
      res = _stringify(t);
      if (res === null)
        throw new Error(`Unsupported default string type ${t}`);
    }
    return res;
  }
  exports.stringifyString = stringifyString;
});

// node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS(function(exports) {
  var anchors = require_anchors();
  var identity = require_identity();
  var stringifyComment = require_stringifyComment();
  var stringifyString = require_stringifyString();
  function createStringifyContext(doc, options) {
    const opt = Object.assign({
      blockQuote: true,
      commentString: stringifyComment.stringifyComment,
      defaultKeyType: null,
      defaultStringType: "PLAIN",
      directives: null,
      doubleQuotedAsJSON: false,
      doubleQuotedMinMultiLineLength: 40,
      falseStr: "false",
      flowCollectionPadding: true,
      indentSeq: true,
      lineWidth: 80,
      minContentWidth: 20,
      nullStr: "null",
      simpleKeys: false,
      singleQuote: null,
      trailingComma: false,
      trueStr: "true",
      verifyAliasOrder: true
    }, doc.schema.toStringOptions, options);
    let inFlow;
    switch (opt.collectionStyle) {
      case "block":
        inFlow = false;
        break;
      case "flow":
        inFlow = true;
        break;
      default:
        inFlow = null;
    }
    return {
      anchors: new Set,
      doc,
      flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
      indent: "",
      indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
      inFlow,
      options: opt
    };
  }
  function getTagObject(tags, item) {
    if (item.tag) {
      const match = tags.filter((t) => t.tag === item.tag);
      if (match.length > 0)
        return match.find((t) => t.format === item.format) ?? match[0];
    }
    let tagObj = undefined;
    let obj;
    if (identity.isScalar(item)) {
      obj = item.value;
      let match = tags.filter((t) => t.identify?.(obj));
      if (match.length > 1) {
        const testMatch = match.filter((t) => t.test);
        if (testMatch.length > 0)
          match = testMatch;
      }
      tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
    } else {
      obj = item;
      tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
    }
    if (!tagObj) {
      const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
      throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
  }
  function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
    if (!doc.directives)
      return "";
    const props = [];
    const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
    if (anchor && anchors.anchorIsValid(anchor)) {
      anchors$1.add(anchor);
      props.push(`&${anchor}`);
    }
    const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
    if (tag)
      props.push(doc.directives.tagString(tag));
    return props.join(" ");
  }
  function stringify(item, ctx, onComment, onChompKeep) {
    if (identity.isPair(item))
      return item.toString(ctx, onComment, onChompKeep);
    if (identity.isAlias(item)) {
      if (ctx.doc.directives)
        return item.toString(ctx);
      if (ctx.resolvedAliases?.has(item)) {
        throw new TypeError(`Cannot stringify circular structure without alias nodes`);
      } else {
        if (ctx.resolvedAliases)
          ctx.resolvedAliases.add(item);
        else
          ctx.resolvedAliases = new Set([item]);
        item = item.resolve(ctx.doc);
      }
    }
    let tagObj = undefined;
    const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
    tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
    const props = stringifyProps(node, tagObj, ctx);
    if (props.length > 0)
      ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
    const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
    if (!props)
      return str;
    return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
  }
  exports.createStringifyContext = createStringifyContext;
  exports.stringify = stringify;
});

// node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS(function(exports) {
  var identity = require_identity();
  var Scalar = require_Scalar();
  var stringify = require_stringify();
  var stringifyComment = require_stringifyComment();
  function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
    const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
    let keyComment = identity.isNode(key) && key.comment || null;
    if (simpleKeys) {
      if (keyComment) {
        throw new Error("With simple keys, key nodes cannot have comments");
      }
      if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
        const msg = "With simple keys, collection cannot be used as a key value";
        throw new Error(msg);
      }
    }
    let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
    ctx = Object.assign({}, ctx, {
      allNullValues: false,
      implicitKey: !explicitKey && (simpleKeys || !allNullValues),
      indent: indent + indentStep
    });
    let keyCommentDone = false;
    let chompKeep = false;
    let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
    if (!explicitKey && !ctx.inFlow && str.length > 1024) {
      if (simpleKeys)
        throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
      explicitKey = true;
    }
    if (ctx.inFlow) {
      if (allNullValues || value == null) {
        if (keyCommentDone && onComment)
          onComment();
        return str === "" ? "?" : explicitKey ? `? ${str}` : str;
      }
    } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
      str = `? ${str}`;
      if (keyComment && !keyCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    if (keyCommentDone)
      keyComment = null;
    if (explicitKey) {
      if (keyComment)
        str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      str = `? ${str}
${indent}:`;
    } else {
      str = `${str}:`;
      if (keyComment)
        str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
    }
    let vsb, vcb, valueComment;
    if (identity.isNode(value)) {
      vsb = !!value.spaceBefore;
      vcb = value.commentBefore;
      valueComment = value.comment;
    } else {
      vsb = false;
      vcb = null;
      valueComment = null;
      if (value && typeof value === "object")
        value = doc.createNode(value);
    }
    ctx.implicitKey = false;
    if (!explicitKey && !keyComment && identity.isScalar(value))
      ctx.indentAtStart = str.length + 1;
    chompKeep = false;
    if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
      ctx.indent = ctx.indent.substring(2);
    }
    let valueCommentDone = false;
    const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
    let ws = " ";
    if (keyComment || vsb || vcb) {
      ws = vsb ? `
` : "";
      if (vcb) {
        const cs = commentString(vcb);
        ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
      }
      if (valueStr === "" && !ctx.inFlow) {
        if (ws === `
` && valueComment)
          ws = `

`;
      } else {
        ws += `
${ctx.indent}`;
      }
    } else if (!explicitKey && identity.isCollection(value)) {
      const vs0 = valueStr[0];
      const nl0 = valueStr.indexOf(`
`);
      const hasNewline = nl0 !== -1;
      const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
      if (hasNewline || !flow) {
        let hasPropsLine = false;
        if (hasNewline && (vs0 === "&" || vs0 === "!")) {
          let sp0 = valueStr.indexOf(" ");
          if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
            sp0 = valueStr.indexOf(" ", sp0 + 1);
          }
          if (sp0 === -1 || nl0 < sp0)
            hasPropsLine = true;
        }
        if (!hasPropsLine)
          ws = `
${ctx.indent}`;
      }
    } else if (valueStr === "" || valueStr[0] === `
`) {
      ws = "";
    }
    str += ws + valueStr;
    if (ctx.inFlow) {
      if (valueCommentDone && onComment)
        onComment();
    } else if (valueComment && !valueCommentDone) {
      str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
    } else if (chompKeep && onChompKeep) {
      onChompKeep();
    }
    return str;
  }
  exports.stringifyPair = stringifyPair;
});

// node_modules/yaml/dist/log.js
var require_log = __commonJS(function(exports) {
  var node_process = __require("process");
  function debug(logLevel, ...messages) {
    if (logLevel === "debug")
      console.log(...messages);
  }
  function warn(logLevel, warning) {
    if (logLevel === "debug" || logLevel === "warn") {
      if (typeof node_process.emitWarning === "function")
        node_process.emitWarning(warning);
      else
        console.warn(warning);
    }
  }
  exports.debug = debug;
  exports.warn = warn;
});

// node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS(function(exports) {
  var identity = require_identity();
  var Scalar = require_Scalar();
  var MERGE_KEY = "<<";
  var merge = {
    identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
    default: "key",
    tag: "tag:yaml.org,2002:merge",
    test: /^<<$/,
    resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
      addToJSMap: addMergeToJSMap
    }),
    stringify: () => MERGE_KEY
  };
  var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
  function addMergeToJSMap(ctx, map, value) {
    const source = resolveAliasValue(ctx, value);
    if (identity.isSeq(source))
      for (const it of source.items)
        mergeValue(ctx, map, it);
    else if (Array.isArray(source))
      for (const it of source)
        mergeValue(ctx, map, it);
    else
      mergeValue(ctx, map, source);
  }
  function mergeValue(ctx, map, value) {
    const source = resolveAliasValue(ctx, value);
    if (!identity.isMap(source))
      throw new Error("Merge sources must be maps or map aliases");
    const srcMap = source.toJSON(null, ctx, Map);
    for (const [key, value] of srcMap) {
      if (map instanceof Map) {
        if (!map.has(key))
          map.set(key, value);
      } else if (map instanceof Set) {
        map.add(key);
      } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
        Object.defineProperty(map, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
    return map;
  }
  function resolveAliasValue(ctx, value) {
    return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
  }
  exports.addMergeToJSMap = addMergeToJSMap;
  exports.isMergeKey = isMergeKey;
  exports.merge = merge;
});

// node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS(function(exports) {
  var log = require_log();
  var merge = require_merge();
  var stringify = require_stringify();
  var identity = require_identity();
  var toJS = require_toJS();
  function addPairToJSMap(ctx, map, { key, value }) {
    if (identity.isNode(key) && key.addToJSMap)
      key.addToJSMap(ctx, map, value);
    else if (merge.isMergeKey(ctx, key))
      merge.addMergeToJSMap(ctx, map, value);
    else {
      const jsKey = toJS.toJS(key, "", ctx);
      if (map instanceof Map) {
        map.set(jsKey, toJS.toJS(value, jsKey, ctx));
      } else if (map instanceof Set) {
        map.add(jsKey);
      } else {
        const stringKey = stringifyKey(key, jsKey, ctx);
        const jsValue = toJS.toJS(value, stringKey, ctx);
        if (stringKey in map)
          Object.defineProperty(map, stringKey, {
            value: jsValue,
            writable: true,
            enumerable: true,
            configurable: true
          });
        else
          map[stringKey] = jsValue;
      }
    }
    return map;
  }
  function stringifyKey(key, jsKey, ctx) {
    if (jsKey === null)
      return "";
    if (typeof jsKey !== "object")
      return String(jsKey);
    if (identity.isNode(key) && ctx?.doc) {
      const strCtx = stringify.createStringifyContext(ctx.doc, {});
      strCtx.anchors = new Set;
      for (const node of ctx.anchors.keys())
        strCtx.anchors.add(node.anchor);
      strCtx.inFlow = true;
      strCtx.inStringifyKey = true;
      const strKey = key.toString(strCtx);
      if (!ctx.mapKeyWarned) {
        let jsonStr = JSON.stringify(strKey);
        if (jsonStr.length > 40)
          jsonStr = jsonStr.substring(0, 36) + '..."';
        log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
        ctx.mapKeyWarned = true;
      }
      return strKey;
    }
    return JSON.stringify(jsKey);
  }
  exports.addPairToJSMap = addPairToJSMap;
});

// node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS(function(exports) {
  var createNode = require_createNode();
  var stringifyPair = require_stringifyPair();
  var addPairToJSMap = require_addPairToJSMap();
  var identity = require_identity();
  function createPair(key, value, ctx) {
    const k = createNode.createNode(key, undefined, ctx);
    const v = createNode.createNode(value, undefined, ctx);
    return new Pair(k, v);
  }

  class Pair {
    constructor(key, value = null) {
      Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
      this.key = key;
      this.value = value;
    }
    clone(schema) {
      let { key, value } = this;
      if (identity.isNode(key))
        key = key.clone(schema);
      if (identity.isNode(value))
        value = value.clone(schema);
      return new Pair(key, value);
    }
    toJSON(_, ctx) {
      const pair = ctx?.mapAsMap ? new Map : {};
      return addPairToJSMap.addPairToJSMap(ctx, pair, this);
    }
    toString(ctx, onComment, onChompKeep) {
      return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
    }
  }
  exports.Pair = Pair;
  exports.createPair = createPair;
});

// node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS(function(exports) {
  var identity = require_identity();
  var stringify = require_stringify();
  var stringifyComment = require_stringifyComment();
  function stringifyCollection(collection, ctx, options) {
    const flow = ctx.inFlow ?? collection.flow;
    const stringify = flow ? stringifyFlowCollection : stringifyBlockCollection;
    return stringify(collection, ctx, options);
  }
  function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
    const { indent, options: { commentString } } = ctx;
    const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
    let chompKeep = false;
    const lines = [];
    for (let i = 0;i < items.length; ++i) {
      const item = items[i];
      let comment = null;
      if (identity.isNode(item)) {
        if (!chompKeep && item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
        if (item.comment)
          comment = item.comment;
      } else if (identity.isPair(item)) {
        const ik = identity.isNode(item.key) ? item.key : null;
        if (ik) {
          if (!chompKeep && ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
        }
      }
      chompKeep = false;
      let str = stringify.stringify(item, itemCtx, () => comment = null, () => chompKeep = true);
      if (comment)
        str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
      if (chompKeep && comment)
        chompKeep = false;
      lines.push(blockItemPrefix + str);
    }
    let str;
    if (lines.length === 0) {
      str = flowChars.start + flowChars.end;
    } else {
      str = lines[0];
      for (let i = 1;i < lines.length; ++i) {
        const line = lines[i];
        str += line ? `
${indent}${line}` : `
`;
      }
    }
    if (comment) {
      str += `
` + stringifyComment.indentComment(commentString(comment), indent);
      if (onComment)
        onComment();
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
    const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
    itemIndent += indentStep;
    const itemCtx = Object.assign({}, ctx, {
      indent: itemIndent,
      inFlow: true,
      type: null
    });
    let reqNewline = false;
    let linesAtValue = 0;
    const lines = [];
    for (let i = 0;i < items.length; ++i) {
      const item = items[i];
      let comment = null;
      if (identity.isNode(item)) {
        if (item.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, item.commentBefore, false);
        if (item.comment)
          comment = item.comment;
      } else if (identity.isPair(item)) {
        const ik = identity.isNode(item.key) ? item.key : null;
        if (ik) {
          if (ik.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, ik.commentBefore, false);
          if (ik.comment)
            reqNewline = true;
        }
        const iv = identity.isNode(item.value) ? item.value : null;
        if (iv) {
          if (iv.comment)
            comment = iv.comment;
          if (iv.commentBefore)
            reqNewline = true;
        } else if (item.value == null && ik?.comment) {
          comment = ik.comment;
        }
      }
      if (comment)
        reqNewline = true;
      let str = stringify.stringify(item, itemCtx, () => comment = null);
      reqNewline || (reqNewline = lines.length > linesAtValue || str.includes(`
`));
      if (i < items.length - 1) {
        str += ",";
      } else if (ctx.options.trailingComma) {
        if (ctx.options.lineWidth > 0) {
          reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
        }
        if (reqNewline) {
          str += ",";
        }
      }
      if (comment)
        str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
      lines.push(str);
      linesAtValue = lines.length;
    }
    const { start, end } = flowChars;
    if (lines.length === 0) {
      return start + end;
    } else {
      if (!reqNewline) {
        const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
        reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
      }
      if (reqNewline) {
        let str = start;
        for (const line of lines)
          str += line ? `
${indentStep}${indent}${line}` : `
`;
        return `${str}
${indent}${end}`;
      } else {
        return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
      }
    }
  }
  function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
    if (comment && chompKeep)
      comment = comment.replace(/^\n+/, "");
    if (comment) {
      const ic = stringifyComment.indentComment(commentString(comment), indent);
      lines.push(ic.trimStart());
    }
  }
  exports.stringifyCollection = stringifyCollection;
});

// node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS(function(exports) {
  var stringifyCollection = require_stringifyCollection();
  var addPairToJSMap = require_addPairToJSMap();
  var Collection = require_Collection();
  var identity = require_identity();
  var Pair = require_Pair();
  var Scalar = require_Scalar();
  function findPair(items, key) {
    const k = identity.isScalar(key) ? key.value : key;
    for (const it of items) {
      if (identity.isPair(it)) {
        if (it.key === key || it.key === k)
          return it;
        if (identity.isScalar(it.key) && it.key.value === k)
          return it;
      }
    }
    return;
  }

  class YAMLMap extends Collection.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:map";
    }
    constructor(schema) {
      super(identity.MAP, schema);
      this.items = [];
    }
    static from(schema, obj, ctx) {
      const { keepUndefined, replacer } = ctx;
      const map = new this(schema);
      const add = (key, value) => {
        if (typeof replacer === "function")
          value = replacer.call(obj, key, value);
        else if (Array.isArray(replacer) && !replacer.includes(key))
          return;
        if (value !== undefined || keepUndefined)
          map.items.push(Pair.createPair(key, value, ctx));
      };
      if (obj instanceof Map) {
        for (const [key, value] of obj)
          add(key, value);
      } else if (obj && typeof obj === "object") {
        for (const key of Object.keys(obj))
          add(key, obj[key]);
      }
      if (typeof schema.sortMapEntries === "function") {
        map.items.sort(schema.sortMapEntries);
      }
      return map;
    }
    add(pair, overwrite) {
      let _pair;
      if (identity.isPair(pair))
        _pair = pair;
      else if (!pair || typeof pair !== "object" || !("key" in pair)) {
        _pair = new Pair.Pair(pair, pair?.value);
      } else
        _pair = new Pair.Pair(pair.key, pair.value);
      const prev = findPair(this.items, _pair.key);
      const sortEntries = this.schema?.sortMapEntries;
      if (prev) {
        if (!overwrite)
          throw new Error(`Key ${_pair.key} already set`);
        if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
          prev.value.value = _pair.value;
        else
          prev.value = _pair.value;
      } else if (sortEntries) {
        const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
        if (i === -1)
          this.items.push(_pair);
        else
          this.items.splice(i, 0, _pair);
      } else {
        this.items.push(_pair);
      }
    }
    delete(key) {
      const it = findPair(this.items, key);
      if (!it)
        return false;
      const del = this.items.splice(this.items.indexOf(it), 1);
      return del.length > 0;
    }
    get(key, keepScalar) {
      const it = findPair(this.items, key);
      const node = it?.value;
      return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? undefined;
    }
    has(key) {
      return !!findPair(this.items, key);
    }
    set(key, value) {
      this.add(new Pair.Pair(key, value), true);
    }
    toJSON(_, ctx, Type) {
      const map = Type ? new Type : ctx?.mapAsMap ? new Map : {};
      if (ctx?.onCreate)
        ctx.onCreate(map);
      for (const item of this.items)
        addPairToJSMap.addPairToJSMap(ctx, map, item);
      return map;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      for (const item of this.items) {
        if (!identity.isPair(item))
          throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
      }
      if (!ctx.allNullValues && this.hasAllNullValues(false))
        ctx = Object.assign({}, ctx, { allNullValues: true });
      return stringifyCollection.stringifyCollection(this, ctx, {
        blockItemPrefix: "",
        flowChars: { start: "{", end: "}" },
        itemIndent: ctx.indent || "",
        onChompKeep,
        onComment
      });
    }
  }
  exports.YAMLMap = YAMLMap;
  exports.findPair = findPair;
});

// node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS(function(exports) {
  var identity = require_identity();
  var YAMLMap = require_YAMLMap();
  var map = {
    collection: "map",
    default: true,
    nodeClass: YAMLMap.YAMLMap,
    tag: "tag:yaml.org,2002:map",
    resolve(map, onError) {
      if (!identity.isMap(map))
        onError("Expected a mapping for this tag");
      return map;
    },
    createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
  };
  exports.map = map;
});

// node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS(function(exports) {
  var createNode = require_createNode();
  var stringifyCollection = require_stringifyCollection();
  var Collection = require_Collection();
  var identity = require_identity();
  var Scalar = require_Scalar();
  var toJS = require_toJS();

  class YAMLSeq extends Collection.Collection {
    static get tagName() {
      return "tag:yaml.org,2002:seq";
    }
    constructor(schema) {
      super(identity.SEQ, schema);
      this.items = [];
    }
    add(value) {
      this.items.push(value);
    }
    delete(key) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        return false;
      const del = this.items.splice(idx, 1);
      return del.length > 0;
    }
    get(key, keepScalar) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        return;
      const it = this.items[idx];
      return !keepScalar && identity.isScalar(it) ? it.value : it;
    }
    has(key) {
      const idx = asItemIndex(key);
      return typeof idx === "number" && idx < this.items.length;
    }
    set(key, value) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        throw new Error(`Expected a valid index, not ${key}.`);
      const prev = this.items[idx];
      if (identity.isScalar(prev) && Scalar.isScalarValue(value))
        prev.value = value;
      else
        this.items[idx] = value;
    }
    toJSON(_, ctx) {
      const seq = [];
      if (ctx?.onCreate)
        ctx.onCreate(seq);
      let i = 0;
      for (const item of this.items)
        seq.push(toJS.toJS(item, String(i++), ctx));
      return seq;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      return stringifyCollection.stringifyCollection(this, ctx, {
        blockItemPrefix: "- ",
        flowChars: { start: "[", end: "]" },
        itemIndent: (ctx.indent || "") + "  ",
        onChompKeep,
        onComment
      });
    }
    static from(schema, obj, ctx) {
      const { replacer } = ctx;
      const seq = new this(schema);
      if (obj && Symbol.iterator in Object(obj)) {
        let i = 0;
        for (let it of obj) {
          if (typeof replacer === "function") {
            const key = obj instanceof Set ? it : String(i++);
            it = replacer.call(obj, key, it);
          }
          seq.items.push(createNode.createNode(it, undefined, ctx));
        }
      }
      return seq;
    }
  }
  function asItemIndex(key) {
    let idx = identity.isScalar(key) ? key.value : key;
    if (idx && typeof idx === "string")
      idx = Number(idx);
    return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
  }
  exports.YAMLSeq = YAMLSeq;
});

// node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS(function(exports) {
  var identity = require_identity();
  var YAMLSeq = require_YAMLSeq();
  var seq = {
    collection: "seq",
    default: true,
    nodeClass: YAMLSeq.YAMLSeq,
    tag: "tag:yaml.org,2002:seq",
    resolve(seq, onError) {
      if (!identity.isSeq(seq))
        onError("Expected a sequence for this tag");
      return seq;
    },
    createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
  };
  exports.seq = seq;
});

// node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS(function(exports) {
  var stringifyString = require_stringifyString();
  var string = {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: (str) => str,
    stringify(item, ctx, onComment, onChompKeep) {
      ctx = Object.assign({ actualString: true }, ctx);
      return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
    }
  };
  exports.string = string;
});

// node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS(function(exports) {
  var Scalar = require_Scalar();
  var nullTag = {
    identify: (value) => value == null,
    createNode: () => new Scalar.Scalar(null),
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => new Scalar.Scalar(null),
    stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
  };
  exports.nullTag = nullTag;
});

// node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS(function(exports) {
  var Scalar = require_Scalar();
  var boolTag = {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
    stringify({ source, value }, ctx) {
      if (source && boolTag.test.test(source)) {
        const sv = source[0] === "t" || source[0] === "T";
        if (value === sv)
          return source;
      }
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
  };
  exports.boolTag = boolTag;
});

// node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS(function(exports) {
  function stringifyNumber({ format, minFractionDigits, tag, value }) {
    if (typeof value === "bigint")
      return String(value);
    const num = typeof value === "number" ? value : Number(value);
    if (!isFinite(num))
      return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
    let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
    if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
      let i = n.indexOf(".");
      if (i < 0) {
        i = n.length;
        n += ".";
      }
      let d = minFractionDigits - (n.length - i - 1);
      while (d-- > 0)
        n += "0";
    }
    return n;
  }
  exports.stringifyNumber = stringifyNumber;
});

// node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS(function(exports) {
  var Scalar = require_Scalar();
  var stringifyNumber = require_stringifyNumber();
  var floatNaN = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
  };
  var floatExp = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str),
    stringify(node) {
      const num = Number(node.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
  };
  var float = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
    resolve(str) {
      const node = new Scalar.Scalar(parseFloat(str));
      const dot = str.indexOf(".");
      if (dot !== -1 && str[str.length - 1] === "0")
        node.minFractionDigits = str.length - dot - 1;
      return node;
    },
    stringify: stringifyNumber.stringifyNumber
  };
  exports.float = float;
  exports.floatExp = floatExp;
  exports.floatNaN = floatNaN;
});

// node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS(function(exports) {
  var stringifyNumber = require_stringifyNumber();
  var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
  var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
  function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value) && value >= 0)
      return prefix + value.toString(radix);
    return stringifyNumber.stringifyNumber(node);
  }
  var intOct = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^0o[0-7]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
    stringify: (node) => intStringify(node, 8, "0o")
  };
  var int = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
  };
  var intHex = {
    identify: (value) => intIdentify(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^0x[0-9a-fA-F]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: (node) => intStringify(node, 16, "0x")
  };
  exports.int = int;
  exports.intHex = intHex;
  exports.intOct = intOct;
});

// node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS(function(exports) {
  var map = require_map();
  var _null = require_null();
  var seq = require_seq();
  var string = require_string();
  var bool = require_bool();
  var float = require_float();
  var int = require_int();
  var schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.boolTag,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float
  ];
  exports.schema = schema;
});

// node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS(function(exports) {
  var Scalar = require_Scalar();
  var map = require_map();
  var seq = require_seq();
  function intIdentify(value) {
    return typeof value === "bigint" || Number.isInteger(value);
  }
  var stringifyJSON = ({ value }) => JSON.stringify(value);
  var jsonScalars = [
    {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify: stringifyJSON
    },
    {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^null$/,
      resolve: () => null,
      stringify: stringifyJSON
    },
    {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^true$|^false$/,
      resolve: (str) => str === "true",
      stringify: stringifyJSON
    },
    {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^-?(?:0|[1-9][0-9]*)$/,
      resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
      stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
    },
    {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
      resolve: (str) => parseFloat(str),
      stringify: stringifyJSON
    }
  ];
  var jsonError = {
    default: true,
    tag: "",
    test: /^/,
    resolve(str, onError) {
      onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
      return str;
    }
  };
  var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
  exports.schema = schema;
});

// node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS(function(exports) {
  var node_buffer = __require("buffer");
  var Scalar = require_Scalar();
  var stringifyString = require_stringifyString();
  var binary = {
    identify: (value) => value instanceof Uint8Array,
    default: false,
    tag: "tag:yaml.org,2002:binary",
    resolve(src, onError) {
      if (typeof node_buffer.Buffer === "function") {
        return node_buffer.Buffer.from(src, "base64");
      } else if (typeof atob === "function") {
        const str = atob(src.replace(/[\n\r]/g, ""));
        const buffer = new Uint8Array(str.length);
        for (let i = 0;i < str.length; ++i)
          buffer[i] = str.charCodeAt(i);
        return buffer;
      } else {
        onError("This environment does not support reading binary tags; either Buffer or atob is required");
        return src;
      }
    },
    stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
      if (!value)
        return "";
      const buf = value;
      let str;
      if (typeof node_buffer.Buffer === "function") {
        str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
      } else if (typeof btoa === "function") {
        let s = "";
        for (let i = 0;i < buf.length; ++i)
          s += String.fromCharCode(buf[i]);
        str = btoa(s);
      } else {
        throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
      }
      type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
        const n = Math.ceil(str.length / lineWidth);
        const lines = new Array(n);
        for (let i = 0, o = 0;i < n; ++i, o += lineWidth) {
          lines[i] = str.substr(o, lineWidth);
        }
        str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? `
` : " ");
      }
      return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
    }
  };
  exports.binary = binary;
});

// node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS(function(exports) {
  var identity = require_identity();
  var Pair = require_Pair();
  var Scalar = require_Scalar();
  var YAMLSeq = require_YAMLSeq();
  function resolvePairs(seq, onError) {
    if (identity.isSeq(seq)) {
      for (let i = 0;i < seq.items.length; ++i) {
        let item = seq.items[i];
        if (identity.isPair(item))
          continue;
        else if (identity.isMap(item)) {
          if (item.items.length > 1)
            onError("Each pair must have its own sequence indicator");
          const pair = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
          if (item.commentBefore)
            pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
          if (item.comment) {
            const cn = pair.value ?? pair.key;
            cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
          }
          item = pair;
        }
        seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
      }
    } else
      onError("Expected a sequence for this tag");
    return seq;
  }
  function createPairs(schema, iterable, ctx) {
    const { replacer } = ctx;
    const pairs = new YAMLSeq.YAMLSeq(schema);
    pairs.tag = "tag:yaml.org,2002:pairs";
    let i = 0;
    if (iterable && Symbol.iterator in Object(iterable))
      for (let it of iterable) {
        if (typeof replacer === "function")
          it = replacer.call(iterable, String(i++), it);
        let key, value;
        if (Array.isArray(it)) {
          if (it.length === 2) {
            key = it[0];
            value = it[1];
          } else
            throw new TypeError(`Expected [key, value] tuple: ${it}`);
        } else if (it && it instanceof Object) {
          const keys = Object.keys(it);
          if (keys.length === 1) {
            key = keys[0];
            value = it[key];
          } else {
            throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
          }
        } else {
          key = it;
        }
        pairs.items.push(Pair.createPair(key, value, ctx));
      }
    return pairs;
  }
  var pairs = {
    collection: "seq",
    default: false,
    tag: "tag:yaml.org,2002:pairs",
    resolve: resolvePairs,
    createNode: createPairs
  };
  exports.createPairs = createPairs;
  exports.pairs = pairs;
  exports.resolvePairs = resolvePairs;
});

// node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS(function(exports) {
  var identity = require_identity();
  var toJS = require_toJS();
  var YAMLMap = require_YAMLMap();
  var YAMLSeq = require_YAMLSeq();
  var pairs = require_pairs();

  class YAMLOMap extends YAMLSeq.YAMLSeq {
    constructor() {
      super();
      this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
      this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
      this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
      this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
      this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
      this.tag = YAMLOMap.tag;
    }
    toJSON(_, ctx) {
      if (!ctx)
        return super.toJSON(_);
      const map = new Map;
      if (ctx?.onCreate)
        ctx.onCreate(map);
      for (const pair of this.items) {
        let key, value;
        if (identity.isPair(pair)) {
          key = toJS.toJS(pair.key, "", ctx);
          value = toJS.toJS(pair.value, key, ctx);
        } else {
          key = toJS.toJS(pair, "", ctx);
        }
        if (map.has(key))
          throw new Error("Ordered maps must not include duplicate keys");
        map.set(key, value);
      }
      return map;
    }
    static from(schema, iterable, ctx) {
      const pairs$1 = pairs.createPairs(schema, iterable, ctx);
      const omap = new this;
      omap.items = pairs$1.items;
      return omap;
    }
  }
  YAMLOMap.tag = "tag:yaml.org,2002:omap";
  var omap = {
    collection: "seq",
    identify: (value) => value instanceof Map,
    nodeClass: YAMLOMap,
    default: false,
    tag: "tag:yaml.org,2002:omap",
    resolve(seq, onError) {
      const pairs$1 = pairs.resolvePairs(seq, onError);
      const seenKeys = [];
      for (const { key } of pairs$1.items) {
        if (identity.isScalar(key)) {
          if (seenKeys.includes(key.value)) {
            onError(`Ordered maps must not include duplicate keys: ${key.value}`);
          } else {
            seenKeys.push(key.value);
          }
        }
      }
      return Object.assign(new YAMLOMap, pairs$1);
    },
    createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
  };
  exports.YAMLOMap = YAMLOMap;
  exports.omap = omap;
});

// node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS(function(exports) {
  var Scalar = require_Scalar();
  function boolStringify({ value, source }, ctx) {
    const boolObj = value ? trueTag : falseTag;
    if (source && boolObj.test.test(source))
      return source;
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
  var trueTag = {
    identify: (value) => value === true,
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => new Scalar.Scalar(true),
    stringify: boolStringify
  };
  var falseTag = {
    identify: (value) => value === false,
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
    resolve: () => new Scalar.Scalar(false),
    stringify: boolStringify
  };
  exports.falseTag = falseTag;
  exports.trueTag = trueTag;
});

// node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS(function(exports) {
  var Scalar = require_Scalar();
  var stringifyNumber = require_stringifyNumber();
  var floatNaN = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
    resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: stringifyNumber.stringifyNumber
  };
  var floatExp = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, "")),
    stringify(node) {
      const num = Number(node.value);
      return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
    }
  };
  var float = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
    resolve(str) {
      const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
      const dot = str.indexOf(".");
      if (dot !== -1) {
        const f = str.substring(dot + 1).replace(/_/g, "");
        if (f[f.length - 1] === "0")
          node.minFractionDigits = f.length;
      }
      return node;
    },
    stringify: stringifyNumber.stringifyNumber
  };
  exports.float = float;
  exports.floatExp = floatExp;
  exports.floatNaN = floatNaN;
});

// node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS(function(exports) {
  var stringifyNumber = require_stringifyNumber();
  var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
  function intResolve(str, offset, radix, { intAsBigInt }) {
    const sign = str[0];
    if (sign === "-" || sign === "+")
      offset += 1;
    str = str.substring(offset).replace(/_/g, "");
    if (intAsBigInt) {
      switch (radix) {
        case 2:
          str = `0b${str}`;
          break;
        case 8:
          str = `0o${str}`;
          break;
        case 16:
          str = `0x${str}`;
          break;
      }
      const n = BigInt(str);
      return sign === "-" ? BigInt(-1) * n : n;
    }
    const n = parseInt(str, radix);
    return sign === "-" ? -1 * n : n;
  }
  function intStringify(node, radix, prefix) {
    const { value } = node;
    if (intIdentify(value)) {
      const str = value.toString(radix);
      return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
    }
    return stringifyNumber.stringifyNumber(node);
  }
  var intBin = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "BIN",
    test: /^[-+]?0b[0-1_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
    stringify: (node) => intStringify(node, 2, "0b")
  };
  var intOct = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^[-+]?0[0-7_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
    stringify: (node) => intStringify(node, 8, "0")
  };
  var int = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9][0-9_]*$/,
    resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
    stringify: stringifyNumber.stringifyNumber
  };
  var intHex = {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^[-+]?0x[0-9a-fA-F_]+$/,
    resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
    stringify: (node) => intStringify(node, 16, "0x")
  };
  exports.int = int;
  exports.intBin = intBin;
  exports.intHex = intHex;
  exports.intOct = intOct;
});

// node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS(function(exports) {
  var identity = require_identity();
  var Pair = require_Pair();
  var YAMLMap = require_YAMLMap();

  class YAMLSet extends YAMLMap.YAMLMap {
    constructor(schema) {
      super(schema);
      this.tag = YAMLSet.tag;
    }
    add(key) {
      let pair;
      if (identity.isPair(key))
        pair = key;
      else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
        pair = new Pair.Pair(key.key, null);
      else
        pair = new Pair.Pair(key, null);
      const prev = YAMLMap.findPair(this.items, pair.key);
      if (!prev)
        this.items.push(pair);
    }
    get(key, keepPair) {
      const pair = YAMLMap.findPair(this.items, key);
      return !keepPair && identity.isPair(pair) ? identity.isScalar(pair.key) ? pair.key.value : pair.key : pair;
    }
    set(key, value) {
      if (typeof value !== "boolean")
        throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
      const prev = YAMLMap.findPair(this.items, key);
      if (prev && !value) {
        this.items.splice(this.items.indexOf(prev), 1);
      } else if (!prev && value) {
        this.items.push(new Pair.Pair(key));
      }
    }
    toJSON(_, ctx) {
      return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      if (this.hasAllNullValues(true))
        return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
      else
        throw new Error("Set items must all have null values");
    }
    static from(schema, iterable, ctx) {
      const { replacer } = ctx;
      const set = new this(schema);
      if (iterable && Symbol.iterator in Object(iterable))
        for (let value of iterable) {
          if (typeof replacer === "function")
            value = replacer.call(iterable, value, value);
          set.items.push(Pair.createPair(value, null, ctx));
        }
      return set;
    }
  }
  YAMLSet.tag = "tag:yaml.org,2002:set";
  var set = {
    collection: "map",
    identify: (value) => value instanceof Set,
    nodeClass: YAMLSet,
    default: false,
    tag: "tag:yaml.org,2002:set",
    createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
    resolve(map, onError) {
      if (identity.isMap(map)) {
        if (map.hasAllNullValues(true))
          return Object.assign(new YAMLSet, map);
        else
          onError("Set items must all have null values");
      } else
        onError("Expected a mapping for this tag");
      return map;
    }
  };
  exports.YAMLSet = YAMLSet;
  exports.set = set;
});

// node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS(function(exports) {
  var stringifyNumber = require_stringifyNumber();
  function parseSexagesimal(str, asBigInt) {
    const sign = str[0];
    const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
    const num = (n) => asBigInt ? BigInt(n) : Number(n);
    const res = parts.replace(/_/g, "").split(":").reduce((res, p) => res * num(60) + num(p), num(0));
    return sign === "-" ? num(-1) * res : res;
  }
  function stringifySexagesimal(node) {
    let { value } = node;
    let num = (n) => n;
    if (typeof value === "bigint")
      num = (n) => BigInt(n);
    else if (isNaN(value) || !isFinite(value))
      return stringifyNumber.stringifyNumber(node);
    let sign = "";
    if (value < 0) {
      sign = "-";
      value *= num(-1);
    }
    const _60 = num(60);
    const parts = [value % _60];
    if (value < 60) {
      parts.unshift(0);
    } else {
      value = (value - parts[0]) / _60;
      parts.unshift(value % _60);
      if (value >= 60) {
        value = (value - parts[0]) / _60;
        parts.unshift(value);
      }
    }
    return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
  }
  var intTime = {
    identify: (value) => typeof value === "bigint" || Number.isInteger(value),
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
    resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
    stringify: stringifySexagesimal
  };
  var floatTime = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "TIME",
    test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
    resolve: (str) => parseSexagesimal(str, false),
    stringify: stringifySexagesimal
  };
  var timestamp = {
    identify: (value) => value instanceof Date,
    default: true,
    tag: "tag:yaml.org,2002:timestamp",
    test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})" + "(?:" + "(?:t|T|[ \\t]+)" + "([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)" + "(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?" + ")?$"),
    resolve(str) {
      const match = str.match(timestamp.test);
      if (!match)
        throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
      const [, year, month, day, hour, minute, second] = match.map(Number);
      const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
      let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
      const tz = match[8];
      if (tz && tz !== "Z") {
        let d = parseSexagesimal(tz, false);
        if (Math.abs(d) < 30)
          d *= 60;
        date -= 60000 * d;
      }
      return new Date(date);
    },
    stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
  };
  exports.floatTime = floatTime;
  exports.intTime = intTime;
  exports.timestamp = timestamp;
});

// node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS(function(exports) {
  var map = require_map();
  var _null = require_null();
  var seq = require_seq();
  var string = require_string();
  var binary = require_binary();
  var bool = require_bool2();
  var float = require_float2();
  var int = require_int2();
  var merge = require_merge();
  var omap = require_omap();
  var pairs = require_pairs();
  var set = require_set();
  var timestamp = require_timestamp();
  var schema = [
    map.map,
    seq.seq,
    string.string,
    _null.nullTag,
    bool.trueTag,
    bool.falseTag,
    int.intBin,
    int.intOct,
    int.int,
    int.intHex,
    float.floatNaN,
    float.floatExp,
    float.float,
    binary.binary,
    merge.merge,
    omap.omap,
    pairs.pairs,
    set.set,
    timestamp.intTime,
    timestamp.floatTime,
    timestamp.timestamp
  ];
  exports.schema = schema;
});

// node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS(function(exports) {
  var map = require_map();
  var _null = require_null();
  var seq = require_seq();
  var string = require_string();
  var bool = require_bool();
  var float = require_float();
  var int = require_int();
  var schema = require_schema();
  var schema$1 = require_schema2();
  var binary = require_binary();
  var merge = require_merge();
  var omap = require_omap();
  var pairs = require_pairs();
  var schema$2 = require_schema3();
  var set = require_set();
  var timestamp = require_timestamp();
  var schemas = new Map([
    ["core", schema.schema],
    ["failsafe", [map.map, seq.seq, string.string]],
    ["json", schema$1.schema],
    ["yaml11", schema$2.schema],
    ["yaml-1.1", schema$2.schema]
  ]);
  var tagsByName = {
    binary: binary.binary,
    bool: bool.boolTag,
    float: float.float,
    floatExp: float.floatExp,
    floatNaN: float.floatNaN,
    floatTime: timestamp.floatTime,
    int: int.int,
    intHex: int.intHex,
    intOct: int.intOct,
    intTime: timestamp.intTime,
    map: map.map,
    merge: merge.merge,
    null: _null.nullTag,
    omap: omap.omap,
    pairs: pairs.pairs,
    seq: seq.seq,
    set: set.set,
    timestamp: timestamp.timestamp
  };
  var coreKnownTags = {
    "tag:yaml.org,2002:binary": binary.binary,
    "tag:yaml.org,2002:merge": merge.merge,
    "tag:yaml.org,2002:omap": omap.omap,
    "tag:yaml.org,2002:pairs": pairs.pairs,
    "tag:yaml.org,2002:set": set.set,
    "tag:yaml.org,2002:timestamp": timestamp.timestamp
  };
  function getTags(customTags, schemaName, addMergeTag) {
    const schemaTags = schemas.get(schemaName);
    if (schemaTags && !customTags) {
      return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
    }
    let tags = schemaTags;
    if (!tags) {
      if (Array.isArray(customTags))
        tags = [];
      else {
        const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
        throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
      }
    }
    if (Array.isArray(customTags)) {
      for (const tag of customTags)
        tags = tags.concat(tag);
    } else if (typeof customTags === "function") {
      tags = customTags(tags.slice());
    }
    if (addMergeTag)
      tags = tags.concat(merge.merge);
    return tags.reduce((tags, tag) => {
      const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
      if (!tagObj) {
        const tagName = JSON.stringify(tag);
        const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
        throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
      }
      if (!tags.includes(tagObj))
        tags.push(tagObj);
      return tags;
    }, []);
  }
  exports.coreKnownTags = coreKnownTags;
  exports.getTags = getTags;
});

// node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS(function(exports) {
  var identity = require_identity();
  var map = require_map();
  var seq = require_seq();
  var string = require_string();
  var tags = require_tags();
  var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;

  class Schema {
    constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
      this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
      this.name = typeof schema === "string" && schema || "core";
      this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
      this.tags = tags.getTags(customTags, this.name, merge);
      this.toStringOptions = toStringDefaults ?? null;
      Object.defineProperty(this, identity.MAP, { value: map.map });
      Object.defineProperty(this, identity.SCALAR, { value: string.string });
      Object.defineProperty(this, identity.SEQ, { value: seq.seq });
      this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
    }
    clone() {
      const copy = Object.create(Schema.prototype, Object.getOwnPropertyDescriptors(this));
      copy.tags = this.tags.slice();
      return copy;
    }
  }
  exports.Schema = Schema;
});

// node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS(function(exports) {
  var identity = require_identity();
  var stringify = require_stringify();
  var stringifyComment = require_stringifyComment();
  function stringifyDocument(doc, options) {
    const lines = [];
    let hasDirectives = options.directives === true;
    if (options.directives !== false && doc.directives) {
      const dir = doc.directives.toString(doc);
      if (dir) {
        lines.push(dir);
        hasDirectives = true;
      } else if (doc.directives.docStart)
        hasDirectives = true;
    }
    if (hasDirectives)
      lines.push("---");
    const ctx = stringify.createStringifyContext(doc, options);
    const { commentString } = ctx.options;
    if (doc.commentBefore) {
      if (lines.length !== 1)
        lines.unshift("");
      const cs = commentString(doc.commentBefore);
      lines.unshift(stringifyComment.indentComment(cs, ""));
    }
    let chompKeep = false;
    let contentComment = null;
    if (doc.contents) {
      if (identity.isNode(doc.contents)) {
        if (doc.contents.spaceBefore && hasDirectives)
          lines.push("");
        if (doc.contents.commentBefore) {
          const cs = commentString(doc.contents.commentBefore);
          lines.push(stringifyComment.indentComment(cs, ""));
        }
        ctx.forceBlockIndent = !!doc.comment;
        contentComment = doc.contents.comment;
      }
      const onChompKeep = contentComment ? undefined : () => chompKeep = true;
      let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
      if (contentComment)
        body += stringifyComment.lineComment(body, "", commentString(contentComment));
      if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
        lines[lines.length - 1] = `--- ${body}`;
      } else
        lines.push(body);
    } else {
      lines.push(stringify.stringify(doc.contents, ctx));
    }
    if (doc.directives?.docEnd) {
      if (doc.comment) {
        const cs = commentString(doc.comment);
        if (cs.includes(`
`)) {
          lines.push("...");
          lines.push(stringifyComment.indentComment(cs, ""));
        } else {
          lines.push(`... ${cs}`);
        }
      } else {
        lines.push("...");
      }
    } else {
      let dc = doc.comment;
      if (dc && chompKeep)
        dc = dc.replace(/^\n+/, "");
      if (dc) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
          lines.push("");
        lines.push(stringifyComment.indentComment(commentString(dc), ""));
      }
    }
    return lines.join(`
`) + `
`;
  }
  exports.stringifyDocument = stringifyDocument;
});

// node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS(function(exports) {
  var Alias = require_Alias();
  var Collection = require_Collection();
  var identity = require_identity();
  var Pair = require_Pair();
  var toJS = require_toJS();
  var Schema = require_Schema();
  var stringifyDocument = require_stringifyDocument();
  var anchors = require_anchors();
  var applyReviver = require_applyReviver();
  var createNode = require_createNode();
  var directives = require_directives();

  class Document {
    constructor(value, replacer, options) {
      this.commentBefore = null;
      this.comment = null;
      this.errors = [];
      this.warnings = [];
      Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === undefined && replacer) {
        options = replacer;
        replacer = undefined;
      }
      const opt = Object.assign({
        intAsBigInt: false,
        keepSourceTokens: false,
        logLevel: "warn",
        prettyErrors: true,
        strict: true,
        stringKeys: false,
        uniqueKeys: true,
        version: "1.2"
      }, options);
      this.options = opt;
      let { version } = opt;
      if (options?._directives) {
        this.directives = options._directives.atDocument();
        if (this.directives.yaml.explicit)
          version = this.directives.yaml.version;
      } else
        this.directives = new directives.Directives({ version });
      this.setSchema(version, options);
      this.contents = value === undefined ? null : this.createNode(value, _replacer, options);
    }
    clone() {
      const copy = Object.create(Document.prototype, {
        [identity.NODE_TYPE]: { value: identity.DOC }
      });
      copy.commentBefore = this.commentBefore;
      copy.comment = this.comment;
      copy.errors = this.errors.slice();
      copy.warnings = this.warnings.slice();
      copy.options = Object.assign({}, this.options);
      if (this.directives)
        copy.directives = this.directives.clone();
      copy.schema = this.schema.clone();
      copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
      if (this.range)
        copy.range = this.range.slice();
      return copy;
    }
    add(value) {
      if (assertCollection(this.contents))
        this.contents.add(value);
    }
    addIn(path, value) {
      if (assertCollection(this.contents))
        this.contents.addIn(path, value);
    }
    createAlias(node, name) {
      if (!node.anchor) {
        const prev = anchors.anchorNames(this);
        node.anchor = !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
      }
      return new Alias.Alias(node.anchor);
    }
    createNode(value, replacer, options) {
      let _replacer = undefined;
      if (typeof replacer === "function") {
        value = replacer.call({ "": value }, "", value);
        _replacer = replacer;
      } else if (Array.isArray(replacer)) {
        const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
        const asStr = replacer.filter(keyToStr).map(String);
        if (asStr.length > 0)
          replacer = replacer.concat(asStr);
        _replacer = replacer;
      } else if (options === undefined && replacer) {
        options = replacer;
        replacer = undefined;
      }
      const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
      const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(this, anchorPrefix || "a");
      const ctx = {
        aliasDuplicateObjects: aliasDuplicateObjects ?? true,
        keepUndefined: keepUndefined ?? false,
        onAnchor,
        onTagObj,
        replacer: _replacer,
        schema: this.schema,
        sourceObjects
      };
      const node = createNode.createNode(value, tag, ctx);
      if (flow && identity.isCollection(node))
        node.flow = true;
      setAnchors();
      return node;
    }
    createPair(key, value, options = {}) {
      const k = this.createNode(key, null, options);
      const v = this.createNode(value, null, options);
      return new Pair.Pair(k, v);
    }
    delete(key) {
      return assertCollection(this.contents) ? this.contents.delete(key) : false;
    }
    deleteIn(path) {
      if (Collection.isEmptyPath(path)) {
        if (this.contents == null)
          return false;
        this.contents = null;
        return true;
      }
      return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
    }
    get(key, keepScalar) {
      return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : undefined;
    }
    getIn(path, keepScalar) {
      if (Collection.isEmptyPath(path))
        return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
      return identity.isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : undefined;
    }
    has(key) {
      return identity.isCollection(this.contents) ? this.contents.has(key) : false;
    }
    hasIn(path) {
      if (Collection.isEmptyPath(path))
        return this.contents !== undefined;
      return identity.isCollection(this.contents) ? this.contents.hasIn(path) : false;
    }
    set(key, value) {
      if (this.contents == null) {
        this.contents = Collection.collectionFromPath(this.schema, [key], value);
      } else if (assertCollection(this.contents)) {
        this.contents.set(key, value);
      }
    }
    setIn(path, value) {
      if (Collection.isEmptyPath(path)) {
        this.contents = value;
      } else if (this.contents == null) {
        this.contents = Collection.collectionFromPath(this.schema, Array.from(path), value);
      } else if (assertCollection(this.contents)) {
        this.contents.setIn(path, value);
      }
    }
    setSchema(version, options = {}) {
      if (typeof version === "number")
        version = String(version);
      let opt;
      switch (version) {
        case "1.1":
          if (this.directives)
            this.directives.yaml.version = "1.1";
          else
            this.directives = new directives.Directives({ version: "1.1" });
          opt = { resolveKnownTags: false, schema: "yaml-1.1" };
          break;
        case "1.2":
        case "next":
          if (this.directives)
            this.directives.yaml.version = version;
          else
            this.directives = new directives.Directives({ version });
          opt = { resolveKnownTags: true, schema: "core" };
          break;
        case null:
          if (this.directives)
            delete this.directives;
          opt = null;
          break;
        default: {
          const sv = JSON.stringify(version);
          throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
        }
      }
      if (options.schema instanceof Object)
        this.schema = options.schema;
      else if (opt)
        this.schema = new Schema.Schema(Object.assign(opt, options));
      else
        throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
    }
    toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
      const ctx = {
        anchors: new Map,
        doc: this,
        keep: !json,
        mapAsMap: mapAsMap === true,
        mapKeyWarned: false,
        maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
      };
      const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
      if (typeof onAnchor === "function")
        for (const { count, res } of ctx.anchors.values())
          onAnchor(res, count);
      return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
    }
    toJSON(jsonArg, onAnchor) {
      return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
    }
    toString(options = {}) {
      if (this.errors.length > 0)
        throw new Error("Document with errors cannot be stringified");
      if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
        const s = JSON.stringify(options.indent);
        throw new Error(`"indent" option must be a positive integer, not ${s}`);
      }
      return stringifyDocument.stringifyDocument(this, options);
    }
  }
  function assertCollection(contents) {
    if (identity.isCollection(contents))
      return true;
    throw new Error("Expected a YAML collection as document contents");
  }
  exports.Document = Document;
});

// node_modules/yaml/dist/errors.js
var require_errors = __commonJS(function(exports) {
  class YAMLError extends Error {
    constructor(name, pos, code, message) {
      super();
      this.name = name;
      this.code = code;
      this.message = message;
      this.pos = pos;
    }
  }

  class YAMLParseError extends YAMLError {
    constructor(pos, code, message) {
      super("YAMLParseError", pos, code, message);
    }
  }

  class YAMLWarning extends YAMLError {
    constructor(pos, code, message) {
      super("YAMLWarning", pos, code, message);
    }
  }
  var prettifyError = (src, lc) => (error) => {
    if (error.pos[0] === -1)
      return;
    error.linePos = error.pos.map((pos) => lc.linePos(pos));
    const { line, col } = error.linePos[0];
    error.message += ` at line ${line}, column ${col}`;
    let ci = col - 1;
    let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
    if (ci >= 60 && lineStr.length > 80) {
      const trimStart = Math.min(ci - 39, lineStr.length - 79);
      lineStr = "…" + lineStr.substring(trimStart);
      ci -= trimStart - 1;
    }
    if (lineStr.length > 80)
      lineStr = lineStr.substring(0, 79) + "…";
    if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
      let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
      if (prev.length > 80)
        prev = prev.substring(0, 79) + `…
`;
      lineStr = prev + lineStr;
    }
    if (/[^ ]/.test(lineStr)) {
      let count = 1;
      const end = error.linePos[1];
      if (end?.line === line && end.col > col) {
        count = Math.max(1, Math.min(end.col - col, 80 - ci));
      }
      const pointer = " ".repeat(ci) + "^".repeat(count);
      error.message += `:

${lineStr}
${pointer}
`;
    }
  };
  exports.YAMLError = YAMLError;
  exports.YAMLParseError = YAMLParseError;
  exports.YAMLWarning = YAMLWarning;
  exports.prettifyError = prettifyError;
});

// node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS(function(exports) {
  function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
    let spaceBefore = false;
    let atNewline = startOnNewline;
    let hasSpace = startOnNewline;
    let comment = "";
    let commentSep = "";
    let hasNewline = false;
    let reqSpace = false;
    let tab = null;
    let anchor = null;
    let tag = null;
    let newlineAfterProp = null;
    let comma = null;
    let found = null;
    let start = null;
    for (const token of tokens) {
      if (reqSpace) {
        if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
          onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
        reqSpace = false;
      }
      if (tab) {
        if (atNewline && token.type !== "comment" && token.type !== "newline") {
          onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
        }
        tab = null;
      }
      switch (token.type) {
        case "space":
          if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("\t")) {
            tab = token;
          }
          hasSpace = true;
          break;
        case "comment": {
          if (!hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const cb = token.source.substring(1) || " ";
          if (!comment)
            comment = cb;
          else
            comment += commentSep + cb;
          commentSep = "";
          atNewline = false;
          break;
        }
        case "newline":
          if (atNewline) {
            if (comment)
              comment += token.source;
            else if (!found || indicator !== "seq-item-ind")
              spaceBefore = true;
          } else
            commentSep += token.source;
          atNewline = true;
          hasNewline = true;
          if (anchor || tag)
            newlineAfterProp = token;
          hasSpace = true;
          break;
        case "anchor":
          if (anchor)
            onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
          if (token.source.endsWith(":"))
            onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
          anchor = token;
          start ?? (start = token.offset);
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        case "tag": {
          if (tag)
            onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
          tag = token;
          start ?? (start = token.offset);
          atNewline = false;
          hasSpace = false;
          reqSpace = true;
          break;
        }
        case indicator:
          if (anchor || tag)
            onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
          if (found)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
          found = token;
          atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
          hasSpace = false;
          break;
        case "comma":
          if (flow) {
            if (comma)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
            comma = token;
            atNewline = false;
            hasSpace = false;
            break;
          }
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
          atNewline = false;
          hasSpace = false;
      }
    }
    const last = tokens[tokens.length - 1];
    const end = last ? last.offset + last.source.length : offset;
    if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
      onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
    }
    if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
      onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
    return {
      comma,
      found,
      spaceBefore,
      comment,
      hasNewline,
      anchor,
      tag,
      newlineAfterProp,
      end,
      start: start ?? end
    };
  }
  exports.resolveProps = resolveProps;
});

// node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS(function(exports) {
  function containsNewline(key) {
    if (!key)
      return null;
    switch (key.type) {
      case "alias":
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        if (key.source.includes(`
`))
          return true;
        if (key.end) {
          for (const st of key.end)
            if (st.type === "newline")
              return true;
        }
        return false;
      case "flow-collection":
        for (const it of key.items) {
          for (const st of it.start)
            if (st.type === "newline")
              return true;
          if (it.sep) {
            for (const st of it.sep)
              if (st.type === "newline")
                return true;
          }
          if (containsNewline(it.key) || containsNewline(it.value))
            return true;
        }
        return false;
      default:
        return true;
    }
  }
  exports.containsNewline = containsNewline;
});

// node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS(function(exports) {
  var utilContainsNewline = require_util_contains_newline();
  function flowIndentCheck(indent, fc, onError) {
    if (fc?.type === "flow-collection") {
      const end = fc.end[0];
      if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
        const msg = "Flow end indicator should be more indented than parent";
        onError(end, "BAD_INDENT", msg, true);
      }
    }
  }
  exports.flowIndentCheck = flowIndentCheck;
});

// node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS(function(exports) {
  var identity = require_identity();
  function mapIncludes(ctx, items, search) {
    const { uniqueKeys } = ctx.options;
    if (uniqueKeys === false)
      return false;
    const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
    return items.some((pair) => isEqual(pair.key, search));
  }
  exports.mapIncludes = mapIncludes;
});

// node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS(function(exports) {
  var Pair = require_Pair();
  var YAMLMap = require_YAMLMap();
  var resolveProps = require_resolve_props();
  var utilContainsNewline = require_util_contains_newline();
  var utilFlowIndentCheck = require_util_flow_indent_check();
  var utilMapIncludes = require_util_map_includes();
  var startColMsg = "All mapping items must start at the same column";
  function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
    const map = new NodeClass(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    let offset = bm.offset;
    let commentEnd = null;
    for (const collItem of bm.items) {
      const { start, key, sep, value } = collItem;
      const keyProps = resolveProps.resolveProps(start, {
        indicator: "explicit-key-ind",
        next: key ?? sep?.[0],
        offset,
        onError,
        parentIndent: bm.indent,
        startOnNewline: true
      });
      const implicitKey = !keyProps.found;
      if (implicitKey) {
        if (key) {
          if (key.type === "block-seq")
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
          else if ("indent" in key && key.indent !== bm.indent)
            onError(offset, "BAD_INDENT", startColMsg);
        }
        if (!keyProps.anchor && !keyProps.tag && !sep) {
          commentEnd = keyProps.end;
          if (keyProps.comment) {
            if (map.comment)
              map.comment += `
` + keyProps.comment;
            else
              map.comment = keyProps.comment;
          }
          continue;
        }
        if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
          onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
        }
      } else if (keyProps.found?.indent !== bm.indent) {
        onError(offset, "BAD_INDENT", startColMsg);
      }
      ctx.atKey = true;
      const keyStart = keyProps.end;
      const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
      if (ctx.schema.compat)
        utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
      ctx.atKey = false;
      if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
        onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
      const valueProps = resolveProps.resolveProps(sep ?? [], {
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        parentIndent: bm.indent,
        startOnNewline: !key || key.type === "block-scalar"
      });
      offset = valueProps.end;
      if (valueProps.found) {
        if (implicitKey) {
          if (value?.type === "block-map" && !valueProps.hasNewline)
            onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
          if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
            onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
        }
        const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep, null, valueProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
        offset = valueNode.range[2];
        const pair = new Pair.Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map.items.push(pair);
      } else {
        if (implicitKey)
          onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
        if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += `
` + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair.Pair(keyNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        map.items.push(pair);
      }
    }
    if (commentEnd && commentEnd < offset)
      onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
    map.range = [bm.offset, offset, commentEnd ?? offset];
    return map;
  }
  exports.resolveBlockMap = resolveBlockMap;
});

// node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS(function(exports) {
  var YAMLSeq = require_YAMLSeq();
  var resolveProps = require_resolve_props();
  var utilFlowIndentCheck = require_util_flow_indent_check();
  function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
    const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
    const seq = new NodeClass(ctx.schema);
    if (ctx.atRoot)
      ctx.atRoot = false;
    if (ctx.atKey)
      ctx.atKey = false;
    let offset = bs.offset;
    let commentEnd = null;
    for (const { start, value } of bs.items) {
      const props = resolveProps.resolveProps(start, {
        indicator: "seq-item-ind",
        next: value,
        offset,
        onError,
        parentIndent: bs.indent,
        startOnNewline: true
      });
      if (!props.found) {
        if (props.anchor || props.tag || value) {
          if (value?.type === "block-seq")
            onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
          else
            onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
        } else {
          commentEnd = props.end;
          if (props.comment)
            seq.comment = props.comment;
          continue;
        }
      }
      const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
      if (ctx.schema.compat)
        utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
      offset = node.range[2];
      seq.items.push(node);
    }
    seq.range = [bs.offset, offset, commentEnd ?? offset];
    return seq;
  }
  exports.resolveBlockSeq = resolveBlockSeq;
});

// node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS(function(exports) {
  function resolveEnd(end, offset, reqSpace, onError) {
    let comment = "";
    if (end) {
      let hasSpace = false;
      let sep = "";
      for (const token of end) {
        const { source, type } = token;
        switch (type) {
          case "space":
            hasSpace = true;
            break;
          case "comment": {
            if (reqSpace && !hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += sep + cb;
            sep = "";
            break;
          }
          case "newline":
            if (comment)
              sep += source;
            hasSpace = true;
            break;
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
        }
        offset += source.length;
      }
    }
    return { comment, offset };
  }
  exports.resolveEnd = resolveEnd;
});

// node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS(function(exports) {
  var identity = require_identity();
  var Pair = require_Pair();
  var YAMLMap = require_YAMLMap();
  var YAMLSeq = require_YAMLSeq();
  var resolveEnd = require_resolve_end();
  var resolveProps = require_resolve_props();
  var utilContainsNewline = require_util_contains_newline();
  var utilMapIncludes = require_util_map_includes();
  var blockMsg = "Block collections are not allowed within flow collections";
  var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
  function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
    const isMap = fc.start.source === "{";
    const fcName = isMap ? "flow map" : "flow sequence";
    const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
    const coll = new NodeClass(ctx.schema);
    coll.flow = true;
    const atRoot = ctx.atRoot;
    if (atRoot)
      ctx.atRoot = false;
    if (ctx.atKey)
      ctx.atKey = false;
    let offset = fc.offset + fc.start.source.length;
    for (let i = 0;i < fc.items.length; ++i) {
      const collItem = fc.items[i];
      const { start, key, sep, value } = collItem;
      const props = resolveProps.resolveProps(start, {
        flow: fcName,
        indicator: "explicit-key-ind",
        next: key ?? sep?.[0],
        offset,
        onError,
        parentIndent: fc.indent,
        startOnNewline: false
      });
      if (!props.found) {
        if (!props.anchor && !props.tag && !sep && !value) {
          if (i === 0 && props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
          else if (i < fc.items.length - 1)
            onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
          if (props.comment) {
            if (coll.comment)
              coll.comment += `
` + props.comment;
            else
              coll.comment = props.comment;
          }
          offset = props.end;
          continue;
        }
        if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
          onError(key, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
      }
      if (i === 0) {
        if (props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
      } else {
        if (!props.comma)
          onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
        if (props.comment) {
          let prevItemComment = "";
          loop:
            for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
          if (prevItemComment) {
            let prev = coll.items[coll.items.length - 1];
            if (identity.isPair(prev))
              prev = prev.value ?? prev.key;
            if (prev.comment)
              prev.comment += `
` + prevItemComment;
            else
              prev.comment = prevItemComment;
            props.comment = props.comment.substring(prevItemComment.length + 1);
          }
        }
      }
      if (!isMap && !sep && !props.found) {
        const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep, null, props, onError);
        coll.items.push(valueNode);
        offset = valueNode.range[2];
        if (isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else {
        ctx.atKey = true;
        const keyStart = props.end;
        const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
        if (isBlock(key))
          onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
        ctx.atKey = false;
        const valueProps = resolveProps.resolveProps(sep ?? [], {
          flow: fcName,
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (valueProps.found) {
          if (!isMap && !props.found && ctx.options.strict) {
            if (sep)
              for (const st of sep) {
                if (st === valueProps.found)
                  break;
                if (st.type === "newline") {
                  onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                  break;
                }
              }
            if (props.start < valueProps.found.offset - 1024)
              onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
          }
        } else if (value) {
          if ("source" in value && value.source?.[0] === ":")
            onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
          else
            onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
        }
        const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep, null, valueProps, onError) : null;
        if (valueNode) {
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else if (valueProps.comment) {
          if (keyNode.comment)
            keyNode.comment += `
` + valueProps.comment;
          else
            keyNode.comment = valueProps.comment;
        }
        const pair = new Pair.Pair(keyNode, valueNode);
        if (ctx.options.keepSourceTokens)
          pair.srcToken = collItem;
        if (isMap) {
          const map = coll;
          if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
            onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
          map.items.push(pair);
        } else {
          const map = new YAMLMap.YAMLMap(ctx.schema);
          map.flow = true;
          map.items.push(pair);
          const endRange = (valueNode ?? keyNode).range;
          map.range = [keyNode.range[0], endRange[1], endRange[2]];
          coll.items.push(map);
        }
        offset = valueNode ? valueNode.range[2] : valueProps.end;
      }
    }
    const expectedEnd = isMap ? "}" : "]";
    const [ce, ...ee] = fc.end;
    let cePos = offset;
    if (ce?.source === expectedEnd)
      cePos = ce.offset + ce.source.length;
    else {
      const name = fcName[0].toUpperCase() + fcName.substring(1);
      const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
      onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
      if (ce && ce.source.length !== 1)
        ee.unshift(ce);
    }
    if (ee.length > 0) {
      const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
      if (end.comment) {
        if (coll.comment)
          coll.comment += `
` + end.comment;
        else
          coll.comment = end.comment;
      }
      coll.range = [fc.offset, cePos, end.offset];
    } else {
      coll.range = [fc.offset, cePos, cePos];
    }
    return coll;
  }
  exports.resolveFlowCollection = resolveFlowCollection;
});

// node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS(function(exports) {
  var identity = require_identity();
  var Scalar = require_Scalar();
  var YAMLMap = require_YAMLMap();
  var YAMLSeq = require_YAMLSeq();
  var resolveBlockMap = require_resolve_block_map();
  var resolveBlockSeq = require_resolve_block_seq();
  var resolveFlowCollection = require_resolve_flow_collection();
  function resolveCollection(CN, ctx, token, onError, tagName, tag) {
    const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
    const Coll = coll.constructor;
    if (tagName === "!" || tagName === Coll.tagName) {
      coll.tag = Coll.tagName;
      return coll;
    }
    if (tagName)
      coll.tag = tagName;
    return coll;
  }
  function composeCollection(CN, ctx, token, props, onError) {
    const tagToken = props.tag;
    const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
    if (token.type === "block-seq") {
      const { anchor, newlineAfterProp: nl } = props;
      const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
      if (lastProp && (!nl || nl.offset < lastProp.offset)) {
        const message = "Missing newline after block sequence props";
        onError(lastProp, "MISSING_CHAR", message);
      }
    }
    const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
    if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
      return resolveCollection(CN, ctx, token, onError, tagName);
    }
    let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
    if (!tag) {
      const kt = ctx.schema.knownTags[tagName];
      if (kt?.collection === expType) {
        ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
        tag = kt;
      } else {
        if (kt) {
          onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
        } else {
          onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
        }
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
    }
    const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
    const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
    const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
    node.range = coll.range;
    node.tag = tagName;
    if (tag?.format)
      node.format = tag.format;
    return node;
  }
  exports.composeCollection = composeCollection;
});

// node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS(function(exports) {
  var Scalar = require_Scalar();
  function resolveBlockScalar(ctx, scalar, onError) {
    const start = scalar.offset;
    const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
    if (!header)
      return { value: "", type: null, comment: "", range: [start, start, start] };
    const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
    const lines = scalar.source ? splitLines(scalar.source) : [];
    let chompStart = lines.length;
    for (let i = lines.length - 1;i >= 0; --i) {
      const content = lines[i][1];
      if (content === "" || content === "\r")
        chompStart = i;
      else
        break;
    }
    if (chompStart === 0) {
      const value = header.chomp === "+" && lines.length > 0 ? `
`.repeat(Math.max(1, lines.length - 1)) : "";
      let end = start + header.length;
      if (scalar.source)
        end += scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    let trimIndent = scalar.indent + header.indent;
    let offset = scalar.offset + header.length;
    let contentStart = 0;
    for (let i = 0;i < chompStart; ++i) {
      const [indent, content] = lines[i];
      if (content === "" || content === "\r") {
        if (header.indent === 0 && indent.length > trimIndent)
          trimIndent = indent.length;
      } else {
        if (indent.length < trimIndent) {
          const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
          onError(offset + indent.length, "MISSING_CHAR", message);
        }
        if (header.indent === 0)
          trimIndent = indent.length;
        contentStart = i;
        if (trimIndent === 0 && !ctx.atRoot) {
          const message = "Block scalar values in collections must be indented";
          onError(offset, "BAD_INDENT", message);
        }
        break;
      }
      offset += indent.length + content.length + 1;
    }
    for (let i = lines.length - 1;i >= chompStart; --i) {
      if (lines[i][0].length > trimIndent)
        chompStart = i + 1;
    }
    let value = "";
    let sep = "";
    let prevMoreIndented = false;
    for (let i = 0;i < contentStart; ++i)
      value += lines[i][0].slice(trimIndent) + `
`;
    for (let i = contentStart;i < chompStart; ++i) {
      let [indent, content] = lines[i];
      offset += indent.length + content.length + 1;
      const crlf = content[content.length - 1] === "\r";
      if (crlf)
        content = content.slice(0, -1);
      if (content && indent.length < trimIndent) {
        const src = header.indent ? "explicit indentation indicator" : "first line";
        const message = `Block scalar lines must not be less indented than their ${src}`;
        onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
        indent = "";
      }
      if (type === Scalar.Scalar.BLOCK_LITERAL) {
        value += sep + indent.slice(trimIndent) + content;
        sep = `
`;
      } else if (indent.length > trimIndent || content[0] === "\t") {
        if (sep === " ")
          sep = `
`;
        else if (!prevMoreIndented && sep === `
`)
          sep = `

`;
        value += sep + indent.slice(trimIndent) + content;
        sep = `
`;
        prevMoreIndented = true;
      } else if (content === "") {
        if (sep === `
`)
          value += `
`;
        else
          sep = `
`;
      } else {
        value += sep + content;
        sep = " ";
        prevMoreIndented = false;
      }
    }
    switch (header.chomp) {
      case "-":
        break;
      case "+":
        for (let i = chompStart;i < lines.length; ++i)
          value += `
` + lines[i][0].slice(trimIndent);
        if (value[value.length - 1] !== `
`)
          value += `
`;
        break;
      default:
        value += `
`;
    }
    const end = start + header.length + scalar.source.length;
    return { value, type, comment: header.comment, range: [start, end, end] };
  }
  function parseBlockScalarHeader({ offset, props }, strict, onError) {
    if (props[0].type !== "block-scalar-header") {
      onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
      return null;
    }
    const { source } = props[0];
    const mode = source[0];
    let indent = 0;
    let chomp = "";
    let error = -1;
    for (let i = 1;i < source.length; ++i) {
      const ch = source[i];
      if (!chomp && (ch === "-" || ch === "+"))
        chomp = ch;
      else {
        const n = Number(ch);
        if (!indent && n)
          indent = n;
        else if (error === -1)
          error = offset + i;
      }
    }
    if (error !== -1)
      onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
    let hasSpace = false;
    let comment = "";
    let length = source.length;
    for (let i = 1;i < props.length; ++i) {
      const token = props[i];
      switch (token.type) {
        case "space":
          hasSpace = true;
        case "newline":
          length += token.source.length;
          break;
        case "comment":
          if (strict && !hasSpace) {
            const message = "Comments must be separated from other tokens by white space characters";
            onError(token, "MISSING_CHAR", message);
          }
          length += token.source.length;
          comment = token.source.substring(1);
          break;
        case "error":
          onError(token, "UNEXPECTED_TOKEN", token.message);
          length += token.source.length;
          break;
        default: {
          const message = `Unexpected token in block scalar header: ${token.type}`;
          onError(token, "UNEXPECTED_TOKEN", message);
          const ts = token.source;
          if (ts && typeof ts === "string")
            length += ts.length;
        }
      }
    }
    return { mode, indent, chomp, comment, length };
  }
  function splitLines(source) {
    const split = source.split(/\n( *)/);
    const first = split[0];
    const m = first.match(/^( *)/);
    const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
    const lines = [line0];
    for (let i = 1;i < split.length; i += 2)
      lines.push([split[i], split[i + 1]]);
    return lines;
  }
  exports.resolveBlockScalar = resolveBlockScalar;
});

// node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS(function(exports) {
  var Scalar = require_Scalar();
  var resolveEnd = require_resolve_end();
  function resolveFlowScalar(scalar, strict, onError) {
    const { offset, type, source, end } = scalar;
    let _type;
    let value;
    const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
    switch (type) {
      case "scalar":
        _type = Scalar.Scalar.PLAIN;
        value = plainValue(source, _onError);
        break;
      case "single-quoted-scalar":
        _type = Scalar.Scalar.QUOTE_SINGLE;
        value = singleQuotedValue(source, _onError);
        break;
      case "double-quoted-scalar":
        _type = Scalar.Scalar.QUOTE_DOUBLE;
        value = doubleQuotedValue(source, _onError);
        break;
      default:
        onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
        return {
          value: "",
          type: null,
          comment: "",
          range: [offset, offset + source.length, offset + source.length]
        };
    }
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
    return {
      value,
      type: _type,
      comment: re.comment,
      range: [offset, valueEnd, re.offset]
    };
  }
  function plainValue(source, onError) {
    let badChar = "";
    switch (source[0]) {
      case "\t":
        badChar = "a tab character";
        break;
      case ",":
        badChar = "flow indicator character ,";
        break;
      case "%":
        badChar = "directive indicator character %";
        break;
      case "|":
      case ">": {
        badChar = `block scalar indicator ${source[0]}`;
        break;
      }
      case "@":
      case "`": {
        badChar = `reserved character ${source[0]}`;
        break;
      }
    }
    if (badChar)
      onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
    return unfoldLines(source);
  }
  function singleQuotedValue(source, onError) {
    if (source[source.length - 1] !== "'" || source.length === 1)
      onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
    return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
  }
  function unfoldLines(source) {
    const line = /(.*?)\r?\n/sy;
    let match = line.exec(source);
    if (!match)
      return source;
    let trimEnd, trimBoth;
    try {
      trimEnd = new RegExp("(?<![ \t])[ \t]+$");
      trimBoth = new RegExp("^[ \t]+|(?<![ \t])[ \t]+$", "g");
    } catch {
      trimEnd = /[ \t]+$/;
      trimBoth = /^[ \t]+|[ \t]+$/g;
    }
    let res = match[1].replace(trimEnd, "");
    let sep = " ";
    let pos = line.lastIndex;
    while (match = line.exec(source)) {
      const lm = match[1].replace(trimBoth, "");
      if (lm === "") {
        if (sep === `
`)
          res += sep;
        else
          sep = `
`;
      } else {
        res += sep + lm;
        sep = " ";
      }
      pos = line.lastIndex;
    }
    const last = /[ \t]*(.*)/sy;
    last.lastIndex = pos;
    match = last.exec(source);
    return res + sep + (match?.[1] ?? "");
  }
  function doubleQuotedValue(source, onError) {
    let res = "";
    for (let i = 1;i < source.length - 1; ++i) {
      const ch = source[i];
      if (ch === "\r" && source[i + 1] === `
`)
        continue;
      if (ch === `
`) {
        const { fold, offset } = foldNewline(source, i);
        res += fold;
        i = offset;
      } else if (ch === "\\") {
        let next = source[++i];
        const cc = escapeCodes[next];
        if (cc)
          res += cc;
        else if (next === `
`) {
          next = source[i + 1];
          while (next === " " || next === "\t")
            next = source[++i + 1];
        } else if (next === "\r" && source[i + 1] === `
`) {
          next = source[++i + 1];
          while (next === " " || next === "\t")
            next = source[++i + 1];
        } else if (next === "x" || next === "u" || next === "U") {
          const length = next === "x" ? 2 : next === "u" ? 4 : 8;
          res += parseCharCode(source, i + 1, length, onError);
          i += length;
        } else {
          const raw = source.substr(i - 1, 2);
          onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
          res += raw;
        }
      } else if (ch === " " || ch === "\t") {
        const wsStart = i;
        let next = source[i + 1];
        while (next === " " || next === "\t")
          next = source[++i + 1];
        if (next !== `
` && !(next === "\r" && source[i + 2] === `
`))
          res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
      } else {
        res += ch;
      }
    }
    if (source[source.length - 1] !== '"' || source.length === 1)
      onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
    return res;
  }
  function foldNewline(source, offset) {
    let fold = "";
    let ch = source[offset + 1];
    while (ch === " " || ch === "\t" || ch === `
` || ch === "\r") {
      if (ch === "\r" && source[offset + 2] !== `
`)
        break;
      if (ch === `
`)
        fold += `
`;
      offset += 1;
      ch = source[offset + 1];
    }
    if (!fold)
      fold = " ";
    return { fold, offset };
  }
  var escapeCodes = {
    "0": "\x00",
    a: "\x07",
    b: "\b",
    e: "\x1B",
    f: "\f",
    n: `
`,
    r: "\r",
    t: "\t",
    v: "\v",
    N: "",
    _: " ",
    L: "\u2028",
    P: "\u2029",
    " ": " ",
    '"': '"',
    "/": "/",
    "\\": "\\",
    "\t": "\t"
  };
  function parseCharCode(source, offset, length, onError) {
    const cc = source.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;
    try {
      return String.fromCodePoint(code);
    } catch {
      const raw = source.substr(offset - 2, length + 2);
      onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
      return raw;
    }
  }
  exports.resolveFlowScalar = resolveFlowScalar;
});

// node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS(function(exports) {
  var identity = require_identity();
  var Scalar = require_Scalar();
  var resolveBlockScalar = require_resolve_block_scalar();
  var resolveFlowScalar = require_resolve_flow_scalar();
  function composeScalar(ctx, token, tagToken, onError) {
    const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
    const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
    let tag;
    if (ctx.options.stringKeys && ctx.atKey) {
      tag = ctx.schema[identity.SCALAR];
    } else if (tagName)
      tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
    else if (token.type === "scalar")
      tag = findScalarTagByTest(ctx, value, token, onError);
    else
      tag = ctx.schema[identity.SCALAR];
    let scalar;
    try {
      const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
      scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
      scalar = new Scalar.Scalar(value);
    }
    scalar.range = range;
    scalar.source = value;
    if (type)
      scalar.type = type;
    if (tagName)
      scalar.tag = tagName;
    if (tag.format)
      scalar.format = tag.format;
    if (comment)
      scalar.comment = comment;
    return scalar;
  }
  function findScalarTagByName(schema, value, tagName, tagToken, onError) {
    if (tagName === "!")
      return schema[identity.SCALAR];
    const matchWithTest = [];
    for (const tag of schema.tags) {
      if (!tag.collection && tag.tag === tagName) {
        if (tag.default && tag.test)
          matchWithTest.push(tag);
        else
          return tag;
      }
    }
    for (const tag of matchWithTest)
      if (tag.test?.test(value))
        return tag;
    const kt = schema.knownTags[tagName];
    if (kt && !kt.collection) {
      schema.tags.push(Object.assign({}, kt, { default: false, test: undefined }));
      return kt;
    }
    onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
    return schema[identity.SCALAR];
  }
  function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
    const tag = schema.tags.find((tag) => (tag.default === true || atKey && tag.default === "key") && tag.test?.test(value)) || schema[identity.SCALAR];
    if (schema.compat) {
      const compat = schema.compat.find((tag) => tag.default && tag.test?.test(value)) ?? schema[identity.SCALAR];
      if (tag.tag !== compat.tag) {
        const ts = directives.tagString(tag.tag);
        const cs = directives.tagString(compat.tag);
        const msg = `Value may be parsed as either ${ts} or ${cs}`;
        onError(token, "TAG_RESOLVE_FAILED", msg, true);
      }
    }
    return tag;
  }
  exports.composeScalar = composeScalar;
});

// node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS(function(exports) {
  function emptyScalarPosition(offset, before, pos) {
    if (before) {
      pos ?? (pos = before.length);
      for (let i = pos - 1;i >= 0; --i) {
        let st = before[i];
        switch (st.type) {
          case "space":
          case "comment":
          case "newline":
            offset -= st.source.length;
            continue;
        }
        st = before[++i];
        while (st?.type === "space") {
          offset += st.source.length;
          st = before[++i];
        }
        break;
      }
    }
    return offset;
  }
  exports.emptyScalarPosition = emptyScalarPosition;
});

// node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS(function(exports) {
  var Alias = require_Alias();
  var identity = require_identity();
  var composeCollection = require_compose_collection();
  var composeScalar = require_compose_scalar();
  var resolveEnd = require_resolve_end();
  var utilEmptyScalarPosition = require_util_empty_scalar_position();
  var CN = { composeNode, composeEmptyNode };
  function composeNode(ctx, token, props, onError) {
    const atKey = ctx.atKey;
    const { spaceBefore, comment, anchor, tag } = props;
    let node;
    let isSrcToken = true;
    switch (token.type) {
      case "alias":
        node = composeAlias(ctx, token, onError);
        if (anchor || tag)
          onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
        break;
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "block-scalar":
        node = composeScalar.composeScalar(ctx, token, tag, onError);
        if (anchor)
          node.anchor = anchor.source.substring(1);
        break;
      case "block-map":
      case "block-seq":
      case "flow-collection":
        try {
          node = composeCollection.composeCollection(CN, ctx, token, props, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          onError(token, "RESOURCE_EXHAUSTION", message);
        }
        break;
      default: {
        const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
        onError(token, "UNEXPECTED_TOKEN", message);
        isSrcToken = false;
      }
    }
    node ?? (node = composeEmptyNode(ctx, token.offset, undefined, null, props, onError));
    if (anchor && node.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
      const msg = "With stringKeys, all keys must be strings";
      onError(tag ?? token, "NON_STRING_KEY", msg);
    }
    if (spaceBefore)
      node.spaceBefore = true;
    if (comment) {
      if (token.type === "scalar" && token.source === "")
        node.comment = comment;
      else
        node.commentBefore = comment;
    }
    if (ctx.options.keepSourceTokens && isSrcToken)
      node.srcToken = token;
    return node;
  }
  function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
    const token = {
      type: "scalar",
      offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
      indent: -1,
      source: ""
    };
    const node = composeScalar.composeScalar(ctx, token, tag, onError);
    if (anchor) {
      node.anchor = anchor.source.substring(1);
      if (node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
    }
    if (spaceBefore)
      node.spaceBefore = true;
    if (comment) {
      node.comment = comment;
      node.range[2] = end;
    }
    return node;
  }
  function composeAlias({ options }, { offset, source, end }, onError) {
    const alias = new Alias.Alias(source.substring(1));
    if (alias.source === "")
      onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
    if (alias.source.endsWith(":"))
      onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
    const valueEnd = offset + source.length;
    const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
    alias.range = [offset, valueEnd, re.offset];
    if (re.comment)
      alias.comment = re.comment;
    return alias;
  }
  exports.composeEmptyNode = composeEmptyNode;
  exports.composeNode = composeNode;
});

// node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS(function(exports) {
  var Document = require_Document();
  var composeNode = require_compose_node();
  var resolveEnd = require_resolve_end();
  var resolveProps = require_resolve_props();
  function composeDoc(options, directives, { offset, start, value, end }, onError) {
    const opts = Object.assign({ _directives: directives }, options);
    const doc = new Document.Document(undefined, opts);
    const ctx = {
      atKey: false,
      atRoot: true,
      directives: doc.directives,
      options: doc.options,
      schema: doc.schema
    };
    const props = resolveProps.resolveProps(start, {
      indicator: "doc-start",
      next: value ?? end?.[0],
      offset,
      onError,
      parentIndent: 0,
      startOnNewline: true
    });
    if (props.found) {
      doc.directives.docStart = true;
      if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
        onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
    }
    doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
    const contentEnd = doc.contents.range[2];
    const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
    if (re.comment)
      doc.comment = re.comment;
    doc.range = [offset, contentEnd, re.offset];
    return doc;
  }
  exports.composeDoc = composeDoc;
});

// node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS(function(exports) {
  var node_process = __require("process");
  var directives = require_directives();
  var Document = require_Document();
  var errors = require_errors();
  var identity = require_identity();
  var composeDoc = require_compose_doc();
  var resolveEnd = require_resolve_end();
  function getErrorPos(src) {
    if (typeof src === "number")
      return [src, src + 1];
    if (Array.isArray(src))
      return src.length === 2 ? src : [src[0], src[1]];
    const { offset, source } = src;
    return [offset, offset + (typeof source === "string" ? source.length : 1)];
  }
  function parsePrelude(prelude) {
    let comment = "";
    let atComment = false;
    let afterEmptyLine = false;
    for (let i = 0;i < prelude.length; ++i) {
      const source = prelude[i];
      switch (source[0]) {
        case "#":
          comment += (comment === "" ? "" : afterEmptyLine ? `

` : `
`) + (source.substring(1) || " ");
          atComment = true;
          afterEmptyLine = false;
          break;
        case "%":
          if (prelude[i + 1]?.[0] !== "#")
            i += 1;
          atComment = false;
          break;
        default:
          if (!atComment)
            afterEmptyLine = true;
          atComment = false;
      }
    }
    return { comment, afterEmptyLine };
  }

  class Composer {
    constructor(options = {}) {
      this.doc = null;
      this.atDirectives = false;
      this.prelude = [];
      this.errors = [];
      this.warnings = [];
      this.onError = (source, code, message, warning) => {
        const pos = getErrorPos(source);
        if (warning)
          this.warnings.push(new errors.YAMLWarning(pos, code, message));
        else
          this.errors.push(new errors.YAMLParseError(pos, code, message));
      };
      this.directives = new directives.Directives({ version: options.version || "1.2" });
      this.options = options;
    }
    decorate(doc, afterDoc) {
      const { comment, afterEmptyLine } = parsePrelude(this.prelude);
      if (comment) {
        const dc = doc.contents;
        if (afterDoc) {
          doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
        } else if (afterEmptyLine || doc.directives.docStart || !dc) {
          doc.commentBefore = comment;
        } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
          let it = dc.items[0];
          if (identity.isPair(it))
            it = it.key;
          const cb = it.commentBefore;
          it.commentBefore = cb ? `${comment}
${cb}` : comment;
        } else {
          const cb = dc.commentBefore;
          dc.commentBefore = cb ? `${comment}
${cb}` : comment;
        }
      }
      if (afterDoc) {
        for (let i = 0;i < this.errors.length; ++i)
          doc.errors.push(this.errors[i]);
        for (let i = 0;i < this.warnings.length; ++i)
          doc.warnings.push(this.warnings[i]);
      } else {
        doc.errors = this.errors;
        doc.warnings = this.warnings;
      }
      this.prelude = [];
      this.errors = [];
      this.warnings = [];
    }
    streamInfo() {
      return {
        comment: parsePrelude(this.prelude).comment,
        directives: this.directives,
        errors: this.errors,
        warnings: this.warnings
      };
    }
    *compose(tokens, forceDoc = false, endOffset = -1) {
      for (const token of tokens)
        yield* this.next(token);
      yield* this.end(forceDoc, endOffset);
    }
    *next(token) {
      if (node_process.env.LOG_STREAM)
        console.dir(token, { depth: null });
      switch (token.type) {
        case "directive":
          this.directives.add(token.source, (offset, message, warning) => {
            const pos = getErrorPos(token);
            pos[0] += offset;
            this.onError(pos, "BAD_DIRECTIVE", message, warning);
          });
          this.prelude.push(token.source);
          this.atDirectives = true;
          break;
        case "document": {
          const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
          if (this.atDirectives && !doc.directives.docStart)
            this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
          this.decorate(doc, false);
          if (this.doc)
            yield this.doc;
          this.doc = doc;
          this.atDirectives = false;
          break;
        }
        case "byte-order-mark":
        case "space":
          break;
        case "comment":
        case "newline":
          this.prelude.push(token.source);
          break;
        case "error": {
          const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
          const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
          if (this.atDirectives || !this.doc)
            this.errors.push(error);
          else
            this.doc.errors.push(error);
          break;
        }
        case "doc-end": {
          if (!this.doc) {
            const msg = "Unexpected doc-end without preceding document";
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
            break;
          }
          this.doc.directives.docEnd = true;
          const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
          this.decorate(this.doc, true);
          if (end.comment) {
            const dc = this.doc.comment;
            this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
          }
          this.doc.range[2] = end.offset;
          break;
        }
        default:
          this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
      }
    }
    *end(forceDoc = false, endOffset = -1) {
      if (this.doc) {
        this.decorate(this.doc, true);
        yield this.doc;
        this.doc = null;
      } else if (forceDoc) {
        const opts = Object.assign({ _directives: this.directives }, this.options);
        const doc = new Document.Document(undefined, opts);
        if (this.atDirectives)
          this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
        doc.range = [0, endOffset, endOffset];
        this.decorate(doc, false);
        yield doc;
      }
    }
  }
  exports.Composer = Composer;
});

// node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS(function(exports) {
  var resolveBlockScalar = require_resolve_block_scalar();
  var resolveFlowScalar = require_resolve_flow_scalar();
  var errors = require_errors();
  var stringifyString = require_stringifyString();
  function resolveAsScalar(token, strict = true, onError) {
    if (token) {
      const _onError = (pos, code, message) => {
        const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
        if (onError)
          onError(offset, code, message);
        else
          throw new errors.YAMLParseError([offset, offset + 1], code, message);
      };
      switch (token.type) {
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
        case "block-scalar":
          return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
      }
    }
    return null;
  }
  function createScalarToken(value, context) {
    const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
    const source = stringifyString.stringifyString({ type, value }, {
      implicitKey,
      indent: indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: true, lineWidth: -1 }
    });
    const end = context.end ?? [
      { type: "newline", offset: -1, indent, source: `
` }
    ];
    switch (source[0]) {
      case "|":
      case ">": {
        const he = source.indexOf(`
`);
        const head = source.substring(0, he);
        const body = source.substring(he + 1) + `
`;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, end))
          props.push({ type: "newline", offset: -1, indent, source: `
` });
        return { type: "block-scalar", offset, indent, props, source: body };
      }
      case '"':
        return { type: "double-quoted-scalar", offset, indent, source, end };
      case "'":
        return { type: "single-quoted-scalar", offset, indent, source, end };
      default:
        return { type: "scalar", offset, indent, source, end };
    }
  }
  function setScalarValue(token, value, context = {}) {
    let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
    let indent = "indent" in token ? token.indent : null;
    if (afterKey && typeof indent === "number")
      indent += 2;
    if (!type)
      switch (token.type) {
        case "single-quoted-scalar":
          type = "QUOTE_SINGLE";
          break;
        case "double-quoted-scalar":
          type = "QUOTE_DOUBLE";
          break;
        case "block-scalar": {
          const header = token.props[0];
          if (header.type !== "block-scalar-header")
            throw new Error("Invalid block scalar header");
          type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
          break;
        }
        default:
          type = "PLAIN";
      }
    const source = stringifyString.stringifyString({ type, value }, {
      implicitKey: implicitKey || indent === null,
      indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
      inFlow,
      options: { blockQuote: true, lineWidth: -1 }
    });
    switch (source[0]) {
      case "|":
      case ">":
        setBlockScalarValue(token, source);
        break;
      case '"':
        setFlowScalarValue(token, source, "double-quoted-scalar");
        break;
      case "'":
        setFlowScalarValue(token, source, "single-quoted-scalar");
        break;
      default:
        setFlowScalarValue(token, source, "scalar");
    }
  }
  function setBlockScalarValue(token, source) {
    const he = source.indexOf(`
`);
    const head = source.substring(0, he);
    const body = source.substring(he + 1) + `
`;
    if (token.type === "block-scalar") {
      const header = token.props[0];
      if (header.type !== "block-scalar-header")
        throw new Error("Invalid block scalar header");
      header.source = head;
      token.source = body;
    } else {
      const { offset } = token;
      const indent = "indent" in token ? token.indent : -1;
      const props = [
        { type: "block-scalar-header", offset, indent, source: head }
      ];
      if (!addEndtoBlockProps(props, "end" in token ? token.end : undefined))
        props.push({ type: "newline", offset: -1, indent, source: `
` });
      for (const key of Object.keys(token))
        if (key !== "type" && key !== "offset")
          delete token[key];
      Object.assign(token, { type: "block-scalar", indent, props, source: body });
    }
  }
  function addEndtoBlockProps(props, end) {
    if (end)
      for (const st of end)
        switch (st.type) {
          case "space":
          case "comment":
            props.push(st);
            break;
          case "newline":
            props.push(st);
            return true;
        }
    return false;
  }
  function setFlowScalarValue(token, source, type) {
    switch (token.type) {
      case "scalar":
      case "double-quoted-scalar":
      case "single-quoted-scalar":
        token.type = type;
        token.source = source;
        break;
      case "block-scalar": {
        const end = token.props.slice(1);
        let oa = source.length;
        if (token.props[0].type === "block-scalar-header")
          oa -= token.props[0].source.length;
        for (const tok of end)
          tok.offset += oa;
        delete token.props;
        Object.assign(token, { type, source, end });
        break;
      }
      case "block-map":
      case "block-seq": {
        const offset = token.offset + source.length;
        const nl = { type: "newline", offset, indent: token.indent, source: `
` };
        delete token.items;
        Object.assign(token, { type, source, end: [nl] });
        break;
      }
      default: {
        const indent = "indent" in token ? token.indent : -1;
        const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type, indent, source, end });
      }
    }
  }
  exports.createScalarToken = createScalarToken;
  exports.resolveAsScalar = resolveAsScalar;
  exports.setScalarValue = setScalarValue;
});

// node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS(function(exports) {
  var stringify = (cst) => ("type" in cst) ? stringifyToken(cst) : stringifyItem(cst);
  function stringifyToken(token) {
    switch (token.type) {
      case "block-scalar": {
        let res = "";
        for (const tok of token.props)
          res += stringifyToken(tok);
        return res + token.source;
      }
      case "block-map":
      case "block-seq": {
        let res = "";
        for (const item of token.items)
          res += stringifyItem(item);
        return res;
      }
      case "flow-collection": {
        let res = token.start.source;
        for (const item of token.items)
          res += stringifyItem(item);
        for (const st of token.end)
          res += st.source;
        return res;
      }
      case "document": {
        let res = stringifyItem(token);
        if (token.end)
          for (const st of token.end)
            res += st.source;
        return res;
      }
      default: {
        let res = token.source;
        if ("end" in token && token.end)
          for (const st of token.end)
            res += st.source;
        return res;
      }
    }
  }
  function stringifyItem({ start, key, sep, value }) {
    let res = "";
    for (const st of start)
      res += st.source;
    if (key)
      res += stringifyToken(key);
    if (sep)
      for (const st of sep)
        res += st.source;
    if (value)
      res += stringifyToken(value);
    return res;
  }
  exports.stringify = stringify;
});

// node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS(function(exports) {
  var BREAK = Symbol("break visit");
  var SKIP = Symbol("skip children");
  var REMOVE = Symbol("remove item");
  function visit(cst, visitor) {
    if ("type" in cst && cst.type === "document")
      cst = { start: cst.start, value: cst.value };
    _visit(Object.freeze([]), cst, visitor);
  }
  visit.BREAK = BREAK;
  visit.SKIP = SKIP;
  visit.REMOVE = REMOVE;
  visit.itemAtPath = (cst, path) => {
    let item = cst;
    for (const [field, index] of path) {
      const tok = item?.[field];
      if (tok && "items" in tok) {
        item = tok.items[index];
      } else
        return;
    }
    return item;
  };
  visit.parentCollection = (cst, path) => {
    const parent = visit.itemAtPath(cst, path.slice(0, -1));
    const field = path[path.length - 1][0];
    const coll = parent?.[field];
    if (coll && "items" in coll)
      return coll;
    throw new Error("Parent collection not found");
  };
  function _visit(path, item, visitor) {
    let ctrl = visitor(item, path);
    if (typeof ctrl === "symbol")
      return ctrl;
    for (const field of ["key", "value"]) {
      const token = item[field];
      if (token && "items" in token) {
        for (let i = 0;i < token.items.length; ++i) {
          const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
          if (typeof ci === "number")
            i = ci - 1;
          else if (ci === BREAK)
            return BREAK;
          else if (ci === REMOVE) {
            token.items.splice(i, 1);
            i -= 1;
          }
        }
        if (typeof ctrl === "function" && field === "key")
          ctrl = ctrl(item, path);
      }
    }
    return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
  }
  exports.visit = visit;
});

// node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS(function(exports) {
  var cstScalar = require_cst_scalar();
  var cstStringify = require_cst_stringify();
  var cstVisit = require_cst_visit();
  var BOM = "\uFEFF";
  var DOCUMENT = "\x02";
  var FLOW_END = "\x18";
  var SCALAR = "\x1F";
  var isCollection = (token) => !!token && ("items" in token);
  var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
  function prettyToken(token) {
    switch (token) {
      case BOM:
        return "<BOM>";
      case DOCUMENT:
        return "<DOC>";
      case FLOW_END:
        return "<FLOW_END>";
      case SCALAR:
        return "<SCALAR>";
      default:
        return JSON.stringify(token);
    }
  }
  function tokenType(source) {
    switch (source) {
      case BOM:
        return "byte-order-mark";
      case DOCUMENT:
        return "doc-mode";
      case FLOW_END:
        return "flow-error-end";
      case SCALAR:
        return "scalar";
      case "---":
        return "doc-start";
      case "...":
        return "doc-end";
      case "":
      case `
`:
      case `\r
`:
        return "newline";
      case "-":
        return "seq-item-ind";
      case "?":
        return "explicit-key-ind";
      case ":":
        return "map-value-ind";
      case "{":
        return "flow-map-start";
      case "}":
        return "flow-map-end";
      case "[":
        return "flow-seq-start";
      case "]":
        return "flow-seq-end";
      case ",":
        return "comma";
    }
    switch (source[0]) {
      case " ":
      case "\t":
        return "space";
      case "#":
        return "comment";
      case "%":
        return "directive-line";
      case "*":
        return "alias";
      case "&":
        return "anchor";
      case "!":
        return "tag";
      case "'":
        return "single-quoted-scalar";
      case '"':
        return "double-quoted-scalar";
      case "|":
      case ">":
        return "block-scalar-header";
    }
    return null;
  }
  exports.createScalarToken = cstScalar.createScalarToken;
  exports.resolveAsScalar = cstScalar.resolveAsScalar;
  exports.setScalarValue = cstScalar.setScalarValue;
  exports.stringify = cstStringify.stringify;
  exports.visit = cstVisit.visit;
  exports.BOM = BOM;
  exports.DOCUMENT = DOCUMENT;
  exports.FLOW_END = FLOW_END;
  exports.SCALAR = SCALAR;
  exports.isCollection = isCollection;
  exports.isScalar = isScalar;
  exports.prettyToken = prettyToken;
  exports.tokenType = tokenType;
});

// node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS(function(exports) {
  var cst = require_cst();
  function isEmpty(ch) {
    switch (ch) {
      case undefined:
      case " ":
      case `
`:
      case "\r":
      case "\t":
        return true;
      default:
        return false;
    }
  }
  var hexDigits = new Set("0123456789ABCDEFabcdef");
  var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
  var flowIndicatorChars = new Set(",[]{}");
  var invalidAnchorChars = new Set(` ,[]{}
\r	`);
  var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);

  class Lexer {
    constructor() {
      this.atEnd = false;
      this.blockScalarIndent = -1;
      this.blockScalarKeep = false;
      this.buffer = "";
      this.flowKey = false;
      this.flowLevel = 0;
      this.indentNext = 0;
      this.indentValue = 0;
      this.lineEndPos = null;
      this.next = null;
      this.pos = 0;
    }
    *lex(source, incomplete = false) {
      if (source) {
        if (typeof source !== "string")
          throw TypeError("source is not a string");
        this.buffer = this.buffer ? this.buffer + source : source;
        this.lineEndPos = null;
      }
      this.atEnd = !incomplete;
      let next = this.next ?? "stream";
      while (next && (incomplete || this.hasChars(1)))
        next = yield* this.parseNext(next);
    }
    atLineEnd() {
      let i = this.pos;
      let ch = this.buffer[i];
      while (ch === " " || ch === "\t")
        ch = this.buffer[++i];
      if (!ch || ch === "#" || ch === `
`)
        return true;
      if (ch === "\r")
        return this.buffer[i + 1] === `
`;
      return false;
    }
    charAt(n) {
      return this.buffer[this.pos + n];
    }
    continueScalar(offset) {
      let ch = this.buffer[offset];
      if (this.indentNext > 0) {
        let indent = 0;
        while (ch === " ")
          ch = this.buffer[++indent + offset];
        if (ch === "\r") {
          const next = this.buffer[indent + offset + 1];
          if (next === `
` || !next && !this.atEnd)
            return offset + indent + 1;
        }
        return ch === `
` || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
      }
      if (ch === "-" || ch === ".") {
        const dt = this.buffer.substr(offset, 3);
        if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
          return -1;
      }
      return offset;
    }
    getLine() {
      let end = this.lineEndPos;
      if (typeof end !== "number" || end !== -1 && end < this.pos) {
        end = this.buffer.indexOf(`
`, this.pos);
        this.lineEndPos = end;
      }
      if (end === -1)
        return this.atEnd ? this.buffer.substring(this.pos) : null;
      if (this.buffer[end - 1] === "\r")
        end -= 1;
      return this.buffer.substring(this.pos, end);
    }
    hasChars(n) {
      return this.pos + n <= this.buffer.length;
    }
    setNext(state) {
      this.buffer = this.buffer.substring(this.pos);
      this.pos = 0;
      this.lineEndPos = null;
      this.next = state;
      return null;
    }
    peek(n) {
      return this.buffer.substr(this.pos, n);
    }
    *parseNext(next) {
      switch (next) {
        case "stream":
          return yield* this.parseStream();
        case "line-start":
          return yield* this.parseLineStart();
        case "block-start":
          return yield* this.parseBlockStart();
        case "doc":
          return yield* this.parseDocument();
        case "flow":
          return yield* this.parseFlowCollection();
        case "quoted-scalar":
          return yield* this.parseQuotedScalar();
        case "block-scalar":
          return yield* this.parseBlockScalar();
        case "plain-scalar":
          return yield* this.parsePlainScalar();
      }
    }
    *parseStream() {
      let line = this.getLine();
      if (line === null)
        return this.setNext("stream");
      if (line[0] === cst.BOM) {
        yield* this.pushCount(1);
        line = line.substring(1);
      }
      if (line[0] === "%") {
        let dirEnd = line.length;
        let cs = line.indexOf("#");
        while (cs !== -1) {
          const ch = line[cs - 1];
          if (ch === " " || ch === "\t") {
            dirEnd = cs - 1;
            break;
          } else {
            cs = line.indexOf("#", cs + 1);
          }
        }
        while (true) {
          const ch = line[dirEnd - 1];
          if (ch === " " || ch === "\t")
            dirEnd -= 1;
          else
            break;
        }
        const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
        yield* this.pushCount(line.length - n);
        this.pushNewline();
        return "stream";
      }
      if (this.atLineEnd()) {
        const sp = yield* this.pushSpaces(true);
        yield* this.pushCount(line.length - sp);
        yield* this.pushNewline();
        return "stream";
      }
      yield cst.DOCUMENT;
      return yield* this.parseLineStart();
    }
    *parseLineStart() {
      const ch = this.charAt(0);
      if (!ch && !this.atEnd)
        return this.setNext("line-start");
      if (ch === "-" || ch === ".") {
        if (!this.atEnd && !this.hasChars(4))
          return this.setNext("line-start");
        const s = this.peek(3);
        if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
          yield* this.pushCount(3);
          this.indentValue = 0;
          this.indentNext = 0;
          return s === "---" ? "doc" : "stream";
        }
      }
      this.indentValue = yield* this.pushSpaces(false);
      if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
        this.indentNext = this.indentValue;
      return yield* this.parseBlockStart();
    }
    *parseBlockStart() {
      const [ch0, ch1] = this.peek(2);
      if (!ch1 && !this.atEnd)
        return this.setNext("block-start");
      if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
        const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
        this.indentNext = this.indentValue + 1;
        this.indentValue += n;
        return "block-start";
      }
      return "doc";
    }
    *parseDocument() {
      yield* this.pushSpaces(true);
      const line = this.getLine();
      if (line === null)
        return this.setNext("doc");
      let n = yield* this.pushIndicators();
      switch (line[n]) {
        case "#":
          yield* this.pushCount(line.length - n);
        case undefined:
          yield* this.pushNewline();
          return yield* this.parseLineStart();
        case "{":
        case "[":
          yield* this.pushCount(1);
          this.flowKey = false;
          this.flowLevel = 1;
          return "flow";
        case "}":
        case "]":
          yield* this.pushCount(1);
          return "doc";
        case "*":
          yield* this.pushUntil(isNotAnchorChar);
          return "doc";
        case '"':
        case "'":
          return yield* this.parseQuotedScalar();
        case "|":
        case ">":
          n += yield* this.parseBlockScalarHeader();
          n += yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - n);
          yield* this.pushNewline();
          return yield* this.parseBlockScalar();
        default:
          return yield* this.parsePlainScalar();
      }
    }
    *parseFlowCollection() {
      let nl, sp;
      let indent = -1;
      do {
        nl = yield* this.pushNewline();
        if (nl > 0) {
          sp = yield* this.pushSpaces(false);
          this.indentValue = indent = sp;
        } else {
          sp = 0;
        }
        sp += yield* this.pushSpaces(true);
      } while (nl + sp > 0);
      const line = this.getLine();
      if (line === null)
        return this.setNext("flow");
      if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
        const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
        if (!atFlowEndMarker) {
          this.flowLevel = 0;
          yield cst.FLOW_END;
          return yield* this.parseLineStart();
        }
      }
      let n = 0;
      while (line[n] === ",") {
        n += yield* this.pushCount(1);
        n += yield* this.pushSpaces(true);
        this.flowKey = false;
      }
      n += yield* this.pushIndicators();
      switch (line[n]) {
        case undefined:
          return "flow";
        case "#":
          yield* this.pushCount(line.length - n);
          return "flow";
        case "{":
        case "[":
          yield* this.pushCount(1);
          this.flowKey = false;
          this.flowLevel += 1;
          return "flow";
        case "}":
        case "]":
          yield* this.pushCount(1);
          this.flowKey = true;
          this.flowLevel -= 1;
          return this.flowLevel ? "flow" : "doc";
        case "*":
          yield* this.pushUntil(isNotAnchorChar);
          return "flow";
        case '"':
        case "'":
          this.flowKey = true;
          return yield* this.parseQuotedScalar();
        case ":": {
          const next = this.charAt(1);
          if (this.flowKey || isEmpty(next) || next === ",") {
            this.flowKey = false;
            yield* this.pushCount(1);
            yield* this.pushSpaces(true);
            return "flow";
          }
        }
        default:
          this.flowKey = false;
          return yield* this.parsePlainScalar();
      }
    }
    *parseQuotedScalar() {
      const quote = this.charAt(0);
      let end = this.buffer.indexOf(quote, this.pos + 1);
      if (quote === "'") {
        while (end !== -1 && this.buffer[end + 1] === "'")
          end = this.buffer.indexOf("'", end + 2);
      } else {
        while (end !== -1) {
          let n = 0;
          while (this.buffer[end - 1 - n] === "\\")
            n += 1;
          if (n % 2 === 0)
            break;
          end = this.buffer.indexOf('"', end + 1);
        }
      }
      const qb = this.buffer.substring(0, end);
      let nl = qb.indexOf(`
`, this.pos);
      if (nl !== -1) {
        while (nl !== -1) {
          const cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = qb.indexOf(`
`, cs);
        }
        if (nl !== -1) {
          end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
        }
      }
      if (end === -1) {
        if (!this.atEnd)
          return this.setNext("quoted-scalar");
        end = this.buffer.length;
      }
      yield* this.pushToIndex(end + 1, false);
      return this.flowLevel ? "flow" : "doc";
    }
    *parseBlockScalarHeader() {
      this.blockScalarIndent = -1;
      this.blockScalarKeep = false;
      let i = this.pos;
      while (true) {
        const ch = this.buffer[++i];
        if (ch === "+")
          this.blockScalarKeep = true;
        else if (ch > "0" && ch <= "9")
          this.blockScalarIndent = Number(ch) - 1;
        else if (ch !== "-")
          break;
      }
      return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
    }
    *parseBlockScalar() {
      let nl = this.pos - 1;
      let indent = 0;
      let ch;
      loop:
        for (let i = this.pos;ch = this.buffer[i]; ++i) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case `
`:
              nl = i;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === `
`)
                break;
            }
            default:
              break loop;
          }
        }
      if (!ch && !this.atEnd)
        return this.setNext("block-scalar");
      if (indent >= this.indentNext) {
        if (this.blockScalarIndent === -1)
          this.indentNext = indent;
        else {
          this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
        }
        do {
          const cs = this.continueScalar(nl + 1);
          if (cs === -1)
            break;
          nl = this.buffer.indexOf(`
`, cs);
        } while (nl !== -1);
        if (nl === -1) {
          if (!this.atEnd)
            return this.setNext("block-scalar");
          nl = this.buffer.length;
        }
      }
      let i = nl + 1;
      ch = this.buffer[i];
      while (ch === " ")
        ch = this.buffer[++i];
      if (ch === "\t") {
        while (ch === "\t" || ch === " " || ch === "\r" || ch === `
`)
          ch = this.buffer[++i];
        nl = i - 1;
      } else if (!this.blockScalarKeep) {
        do {
          let i = nl - 1;
          let ch = this.buffer[i];
          if (ch === "\r")
            ch = this.buffer[--i];
          const lastChar = i;
          while (ch === " ")
            ch = this.buffer[--i];
          if (ch === `
` && i >= this.pos && i + 1 + indent > lastChar)
            nl = i;
          else
            break;
        } while (true);
      }
      yield cst.SCALAR;
      yield* this.pushToIndex(nl + 1, true);
      return yield* this.parseLineStart();
    }
    *parsePlainScalar() {
      const inFlow = this.flowLevel > 0;
      let end = this.pos - 1;
      let i = this.pos - 1;
      let ch;
      while (ch = this.buffer[++i]) {
        if (ch === ":") {
          const next = this.buffer[i + 1];
          if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
            break;
          end = i;
        } else if (isEmpty(ch)) {
          let next = this.buffer[i + 1];
          if (ch === "\r") {
            if (next === `
`) {
              i += 1;
              ch = `
`;
              next = this.buffer[i + 1];
            } else
              end = i;
          }
          if (next === "#" || inFlow && flowIndicatorChars.has(next))
            break;
          if (ch === `
`) {
            const cs = this.continueScalar(i + 1);
            if (cs === -1)
              break;
            i = Math.max(i, cs - 2);
          }
        } else {
          if (inFlow && flowIndicatorChars.has(ch))
            break;
          end = i;
        }
      }
      if (!ch && !this.atEnd)
        return this.setNext("plain-scalar");
      yield cst.SCALAR;
      yield* this.pushToIndex(end + 1, true);
      return inFlow ? "flow" : "doc";
    }
    *pushCount(n) {
      if (n > 0) {
        yield this.buffer.substr(this.pos, n);
        this.pos += n;
        return n;
      }
      return 0;
    }
    *pushToIndex(i, allowEmpty) {
      const s = this.buffer.slice(this.pos, i);
      if (s) {
        yield s;
        this.pos += s.length;
        return s.length;
      } else if (allowEmpty)
        yield "";
      return 0;
    }
    *pushIndicators() {
      let n = 0;
      loop:
        while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            case "?":
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
      return n;
    }
    *pushTag() {
      if (this.charAt(1) === "<") {
        let i = this.pos + 2;
        let ch = this.buffer[i];
        while (!isEmpty(ch) && ch !== ">")
          ch = this.buffer[++i];
        return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
      } else {
        let i = this.pos + 1;
        let ch = this.buffer[i];
        while (ch) {
          if (tagChars.has(ch))
            ch = this.buffer[++i];
          else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
            ch = this.buffer[i += 3];
          } else
            break;
        }
        return yield* this.pushToIndex(i, false);
      }
    }
    *pushNewline() {
      const ch = this.buffer[this.pos];
      if (ch === `
`)
        return yield* this.pushCount(1);
      else if (ch === "\r" && this.charAt(1) === `
`)
        return yield* this.pushCount(2);
      else
        return 0;
    }
    *pushSpaces(allowTabs) {
      let i = this.pos - 1;
      let ch;
      do {
        ch = this.buffer[++i];
      } while (ch === " " || allowTabs && ch === "\t");
      const n = i - this.pos;
      if (n > 0) {
        yield this.buffer.substr(this.pos, n);
        this.pos = i;
      }
      return n;
    }
    *pushUntil(test) {
      let i = this.pos;
      let ch = this.buffer[i];
      while (!test(ch))
        ch = this.buffer[++i];
      return yield* this.pushToIndex(i, false);
    }
  }
  exports.Lexer = Lexer;
});

// node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS(function(exports) {
  class LineCounter {
    constructor() {
      this.lineStarts = [];
      this.addNewLine = (offset) => this.lineStarts.push(offset);
      this.linePos = (offset) => {
        let low = 0;
        let high = this.lineStarts.length;
        while (low < high) {
          const mid = low + high >> 1;
          if (this.lineStarts[mid] < offset)
            low = mid + 1;
          else
            high = mid;
        }
        if (this.lineStarts[low] === offset)
          return { line: low + 1, col: 1 };
        if (low === 0)
          return { line: 0, col: offset };
        const start = this.lineStarts[low - 1];
        return { line: low, col: offset - start + 1 };
      };
    }
  }
  exports.LineCounter = LineCounter;
});

// node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS(function(exports) {
  var node_process = __require("process");
  var cst = require_cst();
  var lexer = require_lexer();
  function includesToken(list, type) {
    for (let i = 0;i < list.length; ++i)
      if (list[i].type === type)
        return true;
    return false;
  }
  function findNonEmptyIndex(list) {
    for (let i = 0;i < list.length; ++i) {
      switch (list[i].type) {
        case "space":
        case "comment":
        case "newline":
          break;
        default:
          return i;
      }
    }
    return -1;
  }
  function isFlowToken(token) {
    switch (token?.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
      case "flow-collection":
        return true;
      default:
        return false;
    }
  }
  function getPrevProps(parent) {
    switch (parent.type) {
      case "document":
        return parent.start;
      case "block-map": {
        const it = parent.items[parent.items.length - 1];
        return it.sep ?? it.start;
      }
      case "block-seq":
        return parent.items[parent.items.length - 1].start;
      default:
        return [];
    }
  }
  function getFirstKeyStartProps(prev) {
    if (prev.length === 0)
      return [];
    let i = prev.length;
    loop:
      while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
    while (prev[++i]?.type === "space") {}
    return prev.splice(i, prev.length);
  }
  function arrayPushArray(target, source) {
    if (source.length < 1e5)
      Array.prototype.push.apply(target, source);
    else
      for (let i = 0;i < source.length; ++i)
        target.push(source[i]);
  }
  function fixFlowSeqItems(fc) {
    if (fc.start.type === "flow-seq-start") {
      for (const it of fc.items) {
        if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
          if (it.key)
            it.value = it.key;
          delete it.key;
          if (isFlowToken(it.value)) {
            if (it.value.end)
              arrayPushArray(it.value.end, it.sep);
            else
              it.value.end = it.sep;
          } else
            arrayPushArray(it.start, it.sep);
          delete it.sep;
        }
      }
    }
  }

  class Parser {
    constructor(onNewLine) {
      this.atNewLine = true;
      this.atScalar = false;
      this.indent = 0;
      this.offset = 0;
      this.onKeyLine = false;
      this.stack = [];
      this.source = "";
      this.type = "";
      this.lexer = new lexer.Lexer;
      this.onNewLine = onNewLine;
    }
    *parse(source, incomplete = false) {
      if (this.onNewLine && this.offset === 0)
        this.onNewLine(0);
      for (const lexeme of this.lexer.lex(source, incomplete))
        yield* this.next(lexeme);
      if (!incomplete)
        yield* this.end();
    }
    *next(source) {
      this.source = source;
      if (node_process.env.LOG_TOKENS)
        console.log("|", cst.prettyToken(source));
      if (this.atScalar) {
        this.atScalar = false;
        yield* this.step();
        this.offset += source.length;
        return;
      }
      const type = cst.tokenType(source);
      if (!type) {
        const message = `Not a YAML token: ${source}`;
        yield* this.pop({ type: "error", offset: this.offset, message, source });
        this.offset += source.length;
      } else if (type === "scalar") {
        this.atNewLine = false;
        this.atScalar = true;
        this.type = "scalar";
      } else {
        this.type = type;
        yield* this.step();
        switch (type) {
          case "newline":
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine)
              this.onNewLine(this.offset + source.length);
            break;
          case "space":
            if (this.atNewLine && source[0] === " ")
              this.indent += source.length;
            break;
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
            if (this.atNewLine)
              this.indent += source.length;
            break;
          case "doc-mode":
          case "flow-error-end":
            return;
          default:
            this.atNewLine = false;
        }
        this.offset += source.length;
      }
    }
    *end() {
      while (this.stack.length > 0)
        yield* this.pop();
    }
    get sourceToken() {
      const st = {
        type: this.type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
      return st;
    }
    *step() {
      const top = this.peek(1);
      if (this.type === "doc-end" && top?.type !== "doc-end") {
        while (this.stack.length > 0)
          yield* this.pop();
        this.stack.push({
          type: "doc-end",
          offset: this.offset,
          source: this.source
        });
        return;
      }
      if (!top)
        return yield* this.stream();
      switch (top.type) {
        case "document":
          return yield* this.document(top);
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return yield* this.scalar(top);
        case "block-scalar":
          return yield* this.blockScalar(top);
        case "block-map":
          return yield* this.blockMap(top);
        case "block-seq":
          return yield* this.blockSequence(top);
        case "flow-collection":
          return yield* this.flowCollection(top);
        case "doc-end":
          return yield* this.documentEnd(top);
      }
      yield* this.pop();
    }
    peek(n) {
      return this.stack[this.stack.length - n];
    }
    *pop(error) {
      const token = error ?? this.stack.pop();
      if (!token) {
        const message = "Tried to pop an empty stack";
        yield { type: "error", offset: this.offset, source: "", message };
      } else if (this.stack.length === 0) {
        yield token;
      } else {
        const top = this.peek(1);
        if (token.type === "block-scalar") {
          token.indent = "indent" in top ? top.indent : 0;
        } else if (token.type === "flow-collection" && top.type === "document") {
          token.indent = 0;
        }
        if (token.type === "flow-collection")
          fixFlowSeqItems(token);
        switch (top.type) {
          case "document":
            top.value = token;
            break;
          case "block-scalar":
            top.props.push(token);
            break;
          case "block-map": {
            const it = top.items[top.items.length - 1];
            if (it.value) {
              top.items.push({ start: [], key: token, sep: [] });
              this.onKeyLine = true;
              return;
            } else if (it.sep) {
              it.value = token;
            } else {
              Object.assign(it, { key: token, sep: [] });
              this.onKeyLine = !it.explicitKey;
              return;
            }
            break;
          }
          case "block-seq": {
            const it = top.items[top.items.length - 1];
            if (it.value)
              top.items.push({ start: [], value: token });
            else
              it.value = token;
            break;
          }
          case "flow-collection": {
            const it = top.items[top.items.length - 1];
            if (!it || it.value)
              top.items.push({ start: [], key: token, sep: [] });
            else if (it.sep)
              it.value = token;
            else
              Object.assign(it, { key: token, sep: [] });
            return;
          }
          default:
            yield* this.pop();
            yield* this.pop(token);
        }
        if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
          const last = token.items[token.items.length - 1];
          if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
            if (top.type === "document")
              top.end = last.start;
            else
              top.items.push({ start: last.start });
            token.items.splice(-1, 1);
          }
        }
      }
    }
    *stream() {
      switch (this.type) {
        case "directive-line":
          yield { type: "directive", offset: this.offset, source: this.source };
          return;
        case "byte-order-mark":
        case "space":
        case "comment":
        case "newline":
          yield this.sourceToken;
          return;
        case "doc-mode":
        case "doc-start": {
          const doc = {
            type: "document",
            offset: this.offset,
            start: []
          };
          if (this.type === "doc-start")
            doc.start.push(this.sourceToken);
          this.stack.push(doc);
          return;
        }
      }
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML stream`,
        source: this.source
      };
    }
    *document(doc) {
      if (doc.value)
        return yield* this.lineEnd(doc);
      switch (this.type) {
        case "doc-start": {
          if (findNonEmptyIndex(doc.start) !== -1) {
            yield* this.pop();
            yield* this.step();
          } else
            doc.start.push(this.sourceToken);
          return;
        }
        case "anchor":
        case "tag":
        case "space":
        case "comment":
        case "newline":
          doc.start.push(this.sourceToken);
          return;
      }
      const bv = this.startBlockValue(doc);
      if (bv)
        this.stack.push(bv);
      else {
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML document`,
          source: this.source
        };
      }
    }
    *scalar(scalar) {
      if (this.type === "map-value-ind") {
        const prev = getPrevProps(this.peek(2));
        const start = getFirstKeyStartProps(prev);
        let sep;
        if (scalar.end) {
          sep = scalar.end;
          sep.push(this.sourceToken);
          delete scalar.end;
        } else
          sep = [this.sourceToken];
        const map = {
          type: "block-map",
          offset: scalar.offset,
          indent: scalar.indent,
          items: [{ start, key: scalar, sep }]
        };
        this.onKeyLine = true;
        this.stack[this.stack.length - 1] = map;
      } else
        yield* this.lineEnd(scalar);
    }
    *blockScalar(scalar) {
      switch (this.type) {
        case "space":
        case "comment":
        case "newline":
          scalar.props.push(this.sourceToken);
          return;
        case "scalar":
          scalar.source = this.source;
          this.atNewLine = true;
          this.indent = 0;
          if (this.onNewLine) {
            let nl = this.source.indexOf(`
`) + 1;
            while (nl !== 0) {
              this.onNewLine(this.offset + nl);
              nl = this.source.indexOf(`
`, nl) + 1;
            }
          }
          yield* this.pop();
          break;
        default:
          yield* this.pop();
          yield* this.step();
      }
    }
    *blockMap(map) {
      const it = map.items[map.items.length - 1];
      switch (this.type) {
        case "newline":
          this.onKeyLine = false;
          if (it.value) {
            const end = "end" in it.value ? it.value.end : undefined;
            const last = Array.isArray(end) ? end[end.length - 1] : undefined;
            if (last?.type === "comment")
              end?.push(this.sourceToken);
            else
              map.items.push({ start: [this.sourceToken] });
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            it.start.push(this.sourceToken);
          }
          return;
        case "space":
        case "comment":
          if (it.value) {
            map.items.push({ start: [this.sourceToken] });
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            if (this.atIndentedComment(it.start, map.indent)) {
              const prev = map.items[map.items.length - 2];
              const end = prev?.value?.end;
              if (Array.isArray(end)) {
                arrayPushArray(end, it.start);
                end.push(this.sourceToken);
                map.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
      }
      if (this.indent >= map.indent) {
        const atMapIndent = !this.onKeyLine && this.indent === map.indent;
        const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
        let start = [];
        if (atNextItem && it.sep && !it.value) {
          const nl = [];
          for (let i = 0;i < it.sep.length; ++i) {
            const st = it.sep[i];
            switch (st.type) {
              case "newline":
                nl.push(i);
                break;
              case "space":
                break;
              case "comment":
                if (st.indent > map.indent)
                  nl.length = 0;
                break;
              default:
                nl.length = 0;
            }
          }
          if (nl.length >= 2)
            start = it.sep.splice(nl[1]);
        }
        switch (this.type) {
          case "anchor":
          case "tag":
            if (atNextItem || it.value) {
              start.push(this.sourceToken);
              map.items.push({ start });
              this.onKeyLine = true;
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "explicit-key-ind":
            if (!it.sep && !it.explicitKey) {
              it.start.push(this.sourceToken);
              it.explicitKey = true;
            } else if (atNextItem || it.value) {
              start.push(this.sourceToken);
              map.items.push({ start, explicitKey: true });
            } else {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [this.sourceToken], explicitKey: true }]
              });
            }
            this.onKeyLine = true;
            return;
          case "map-value-ind":
            if (it.explicitKey) {
              if (!it.sep) {
                if (includesToken(it.start, "newline")) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else {
                  const start = getFirstKeyStartProps(it.start);
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                }
              } else if (it.value) {
                map.items.push({ start: [], key: null, sep: [this.sourceToken] });
              } else if (includesToken(it.sep, "map-value-ind")) {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start, key: null, sep: [this.sourceToken] }]
                });
              } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                const start = getFirstKeyStartProps(it.start);
                const key = it.key;
                const sep = it.sep;
                sep.push(this.sourceToken);
                delete it.key;
                delete it.sep;
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start, key, sep }]
                });
              } else if (start.length > 0) {
                it.sep = it.sep.concat(start, this.sourceToken);
              } else {
                it.sep.push(this.sourceToken);
              }
            } else {
              if (!it.sep) {
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              } else if (it.value || atNextItem) {
                map.items.push({ start, key: null, sep: [this.sourceToken] });
              } else if (includesToken(it.sep, "map-value-ind")) {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [], key: null, sep: [this.sourceToken] }]
                });
              } else {
                it.sep.push(this.sourceToken);
              }
            }
            this.onKeyLine = true;
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            const fs = this.flowScalar(this.type);
            if (atNextItem || it.value) {
              map.items.push({ start, key: fs, sep: [] });
              this.onKeyLine = true;
            } else if (it.sep) {
              this.stack.push(fs);
            } else {
              Object.assign(it, { key: fs, sep: [] });
              this.onKeyLine = true;
            }
            return;
          }
          default: {
            const bv = this.startBlockValue(map);
            if (bv) {
              if (bv.type === "block-seq") {
                if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                  yield* this.pop({
                    type: "error",
                    offset: this.offset,
                    message: "Unexpected block-seq-ind on same line with key",
                    source: this.source
                  });
                  return;
                }
              } else if (atMapIndent) {
                map.items.push({ start });
              }
              this.stack.push(bv);
              return;
            }
          }
        }
      }
      yield* this.pop();
      yield* this.step();
    }
    *blockSequence(seq) {
      const it = seq.items[seq.items.length - 1];
      switch (this.type) {
        case "newline":
          if (it.value) {
            const end = "end" in it.value ? it.value.end : undefined;
            const last = Array.isArray(end) ? end[end.length - 1] : undefined;
            if (last?.type === "comment")
              end?.push(this.sourceToken);
            else
              seq.items.push({ start: [this.sourceToken] });
          } else
            it.start.push(this.sourceToken);
          return;
        case "space":
        case "comment":
          if (it.value)
            seq.items.push({ start: [this.sourceToken] });
          else {
            if (this.atIndentedComment(it.start, seq.indent)) {
              const prev = seq.items[seq.items.length - 2];
              const end = prev?.value?.end;
              if (Array.isArray(end)) {
                arrayPushArray(end, it.start);
                end.push(this.sourceToken);
                seq.items.pop();
                return;
              }
            }
            it.start.push(this.sourceToken);
          }
          return;
        case "anchor":
        case "tag":
          if (it.value || this.indent <= seq.indent)
            break;
          it.start.push(this.sourceToken);
          return;
        case "seq-item-ind":
          if (this.indent !== seq.indent)
            break;
          if (it.value || includesToken(it.start, "seq-item-ind"))
            seq.items.push({ start: [this.sourceToken] });
          else
            it.start.push(this.sourceToken);
          return;
      }
      if (this.indent > seq.indent) {
        const bv = this.startBlockValue(seq);
        if (bv) {
          this.stack.push(bv);
          return;
        }
      }
      yield* this.pop();
      yield* this.step();
    }
    *flowCollection(fc) {
      const it = fc.items[fc.items.length - 1];
      if (this.type === "flow-error-end") {
        let top;
        do {
          yield* this.pop();
          top = this.peek(1);
        } while (top?.type === "flow-collection");
      } else if (fc.end.length === 0) {
        switch (this.type) {
          case "comma":
          case "explicit-key-ind":
            if (!it || it.sep)
              fc.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
          case "map-value-ind":
            if (!it || it.value)
              fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            return;
          case "space":
          case "comment":
          case "newline":
          case "anchor":
          case "tag":
            if (!it || it.value)
              fc.items.push({ start: [this.sourceToken] });
            else if (it.sep)
              it.sep.push(this.sourceToken);
            else
              it.start.push(this.sourceToken);
            return;
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar": {
            const fs = this.flowScalar(this.type);
            if (!it || it.value)
              fc.items.push({ start: [], key: fs, sep: [] });
            else if (it.sep)
              this.stack.push(fs);
            else
              Object.assign(it, { key: fs, sep: [] });
            return;
          }
          case "flow-map-end":
          case "flow-seq-end":
            fc.end.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(fc);
        if (bv)
          this.stack.push(bv);
        else {
          yield* this.pop();
          yield* this.step();
        }
      } else {
        const parent = this.peek(2);
        if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
          yield* this.pop();
          yield* this.step();
        } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          fixFlowSeqItems(fc);
          const sep = fc.end.splice(1, fc.end.length);
          sep.push(this.sourceToken);
          const map = {
            type: "block-map",
            offset: fc.offset,
            indent: fc.indent,
            items: [{ start, key: fc, sep }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else {
          yield* this.lineEnd(fc);
        }
      }
    }
    flowScalar(type) {
      if (this.onNewLine) {
        let nl = this.source.indexOf(`
`) + 1;
        while (nl !== 0) {
          this.onNewLine(this.offset + nl);
          nl = this.source.indexOf(`
`, nl) + 1;
        }
      }
      return {
        type,
        offset: this.offset,
        indent: this.indent,
        source: this.source
      };
    }
    startBlockValue(parent) {
      switch (this.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
          return this.flowScalar(this.type);
        case "block-scalar-header":
          return {
            type: "block-scalar",
            offset: this.offset,
            indent: this.indent,
            props: [this.sourceToken],
            source: ""
          };
        case "flow-map-start":
        case "flow-seq-start":
          return {
            type: "flow-collection",
            offset: this.offset,
            indent: this.indent,
            start: this.sourceToken,
            items: [],
            end: []
          };
        case "seq-item-ind":
          return {
            type: "block-seq",
            offset: this.offset,
            indent: this.indent,
            items: [{ start: [this.sourceToken] }]
          };
        case "explicit-key-ind": {
          this.onKeyLine = true;
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          start.push(this.sourceToken);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start, explicitKey: true }]
          };
        }
        case "map-value-ind": {
          this.onKeyLine = true;
          const prev = getPrevProps(parent);
          const start = getFirstKeyStartProps(prev);
          return {
            type: "block-map",
            offset: this.offset,
            indent: this.indent,
            items: [{ start, key: null, sep: [this.sourceToken] }]
          };
        }
      }
      return null;
    }
    atIndentedComment(start, indent) {
      if (this.type !== "comment")
        return false;
      if (this.indent <= indent)
        return false;
      return start.every((st) => st.type === "newline" || st.type === "space");
    }
    *documentEnd(docEnd) {
      if (this.type !== "doc-mode") {
        if (docEnd.end)
          docEnd.end.push(this.sourceToken);
        else
          docEnd.end = [this.sourceToken];
        if (this.type === "newline")
          yield* this.pop();
      }
    }
    *lineEnd(token) {
      switch (this.type) {
        case "comma":
        case "doc-start":
        case "doc-end":
        case "flow-seq-end":
        case "flow-map-end":
        case "map-value-ind":
          yield* this.pop();
          yield* this.step();
          break;
        case "newline":
          this.onKeyLine = false;
        case "space":
        case "comment":
        default:
          if (token.end)
            token.end.push(this.sourceToken);
          else
            token.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
      }
    }
  }
  exports.Parser = Parser;
});

// node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS(function(exports) {
  var composer = require_composer();
  var Document = require_Document();
  var errors = require_errors();
  var log = require_log();
  var identity = require_identity();
  var lineCounter = require_line_counter();
  var parser = require_parser();
  function parseOptions(options) {
    const prettyErrors = options.prettyErrors !== false;
    const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter || null;
    return { lineCounter: lineCounter$1, prettyErrors };
  }
  function parseAllDocuments(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter?.addNewLine);
    const composer$1 = new composer.Composer(options);
    const docs = Array.from(composer$1.compose(parser$1.parse(source)));
    if (prettyErrors && lineCounter)
      for (const doc of docs) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter));
      }
    if (docs.length > 0)
      return docs;
    return Object.assign([], { empty: true }, composer$1.streamInfo());
  }
  function parseDocument(source, options = {}) {
    const { lineCounter, prettyErrors } = parseOptions(options);
    const parser$1 = new parser.Parser(lineCounter?.addNewLine);
    const composer$1 = new composer.Composer(options);
    let doc = null;
    for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
      if (!doc)
        doc = _doc;
      else if (doc.options.logLevel !== "silent") {
        doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
        break;
      }
    }
    if (prettyErrors && lineCounter) {
      doc.errors.forEach(errors.prettifyError(source, lineCounter));
      doc.warnings.forEach(errors.prettifyError(source, lineCounter));
    }
    return doc;
  }
  function parse(src, reviver, options) {
    let _reviver = undefined;
    if (typeof reviver === "function") {
      _reviver = reviver;
    } else if (options === undefined && reviver && typeof reviver === "object") {
      options = reviver;
    }
    const doc = parseDocument(src, options);
    if (!doc)
      return null;
    doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
    if (doc.errors.length > 0) {
      if (doc.options.logLevel !== "silent")
        throw doc.errors[0];
      else
        doc.errors = [];
    }
    return doc.toJS(Object.assign({ reviver: _reviver }, options));
  }
  function stringify(value, replacer, options) {
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) {
      _replacer = replacer;
    } else if (options === undefined && replacer) {
      options = replacer;
    }
    if (typeof options === "string")
      options = options.length;
    if (typeof options === "number") {
      const indent = Math.round(options);
      options = indent < 1 ? undefined : indent > 8 ? { indent: 8 } : { indent };
    }
    if (value === undefined) {
      const { keepUndefined } = options ?? replacer ?? {};
      if (!keepUndefined)
        return;
    }
    if (identity.isDocument(value) && !_replacer)
      return value.toString(options);
    return new Document.Document(value, _replacer, options).toString(options);
  }
  exports.parse = parse;
  exports.parseAllDocuments = parseAllDocuments;
  exports.parseDocument = parseDocument;
  exports.stringify = stringify;
});

// node_modules/picomatch/lib/constants.js
var require_constants = __commonJS(function(exports, module) {
  var WIN_SLASH = "\\\\/";
  var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
  var DEFAULT_MAX_EXTGLOB_RECURSION = 0;
  var DOT_LITERAL = "\\.";
  var PLUS_LITERAL = "\\+";
  var QMARK_LITERAL = "\\?";
  var SLASH_LITERAL = "\\/";
  var ONE_CHAR = "(?=.)";
  var QMARK = "[^/]";
  var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
  var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
  var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
  var NO_DOT = `(?!${DOT_LITERAL})`;
  var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
  var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
  var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
  var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
  var STAR = `${QMARK}*?`;
  var SEP = "/";
  var POSIX_CHARS = {
    DOT_LITERAL,
    PLUS_LITERAL,
    QMARK_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    QMARK,
    END_ANCHOR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR,
    SEP
  };
  var WINDOWS_CHARS = {
    ...POSIX_CHARS,
    SLASH_LITERAL: `[${WIN_SLASH}]`,
    QMARK: WIN_NO_SLASH,
    STAR: `${WIN_NO_SLASH}*?`,
    DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
    NO_DOT: `(?!${DOT_LITERAL})`,
    NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
    NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
    START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
    END_ANCHOR: `(?:[${WIN_SLASH}]|$)`,
    SEP: "\\"
  };
  var POSIX_REGEX_SOURCE = {
    __proto__: null,
    alnum: "a-zA-Z0-9",
    alpha: "a-zA-Z",
    ascii: "\\x00-\\x7F",
    blank: " \\t",
    cntrl: "\\x00-\\x1F\\x7F",
    digit: "0-9",
    graph: "\\x21-\\x7E",
    lower: "a-z",
    print: "\\x20-\\x7E ",
    punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
    space: " \\t\\r\\n\\v\\f",
    upper: "A-Z",
    word: "A-Za-z0-9_",
    xdigit: "A-Fa-f0-9"
  };
  module.exports = {
    DEFAULT_MAX_EXTGLOB_RECURSION,
    MAX_LENGTH: 1024 * 64,
    POSIX_REGEX_SOURCE,
    REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
    REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
    REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
    REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
    REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
    REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
    REPLACEMENTS: {
      __proto__: null,
      "***": "*",
      "**/**": "**",
      "**/**/**": "**"
    },
    CHAR_0: 48,
    CHAR_9: 57,
    CHAR_UPPERCASE_A: 65,
    CHAR_LOWERCASE_A: 97,
    CHAR_UPPERCASE_Z: 90,
    CHAR_LOWERCASE_Z: 122,
    CHAR_LEFT_PARENTHESES: 40,
    CHAR_RIGHT_PARENTHESES: 41,
    CHAR_ASTERISK: 42,
    CHAR_AMPERSAND: 38,
    CHAR_AT: 64,
    CHAR_BACKWARD_SLASH: 92,
    CHAR_CARRIAGE_RETURN: 13,
    CHAR_CIRCUMFLEX_ACCENT: 94,
    CHAR_COLON: 58,
    CHAR_COMMA: 44,
    CHAR_DOT: 46,
    CHAR_DOUBLE_QUOTE: 34,
    CHAR_EQUAL: 61,
    CHAR_EXCLAMATION_MARK: 33,
    CHAR_FORM_FEED: 12,
    CHAR_FORWARD_SLASH: 47,
    CHAR_GRAVE_ACCENT: 96,
    CHAR_HASH: 35,
    CHAR_HYPHEN_MINUS: 45,
    CHAR_LEFT_ANGLE_BRACKET: 60,
    CHAR_LEFT_CURLY_BRACE: 123,
    CHAR_LEFT_SQUARE_BRACKET: 91,
    CHAR_LINE_FEED: 10,
    CHAR_NO_BREAK_SPACE: 160,
    CHAR_PERCENT: 37,
    CHAR_PLUS: 43,
    CHAR_QUESTION_MARK: 63,
    CHAR_RIGHT_ANGLE_BRACKET: 62,
    CHAR_RIGHT_CURLY_BRACE: 125,
    CHAR_RIGHT_SQUARE_BRACKET: 93,
    CHAR_SEMICOLON: 59,
    CHAR_SINGLE_QUOTE: 39,
    CHAR_SPACE: 32,
    CHAR_TAB: 9,
    CHAR_UNDERSCORE: 95,
    CHAR_VERTICAL_LINE: 124,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
    extglobChars(chars) {
      return {
        "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
        "?": { type: "qmark", open: "(?:", close: ")?" },
        "+": { type: "plus", open: "(?:", close: ")+" },
        "*": { type: "star", open: "(?:", close: ")*" },
        "@": { type: "at", open: "(?:", close: ")" }
      };
    },
    globChars(win32) {
      return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
    }
  };
});

// node_modules/picomatch/lib/utils.js
var require_utils = __commonJS(function(exports) {
  var {
    REGEX_BACKSLASH,
    REGEX_REMOVE_BACKSLASH,
    REGEX_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_GLOBAL
  } = require_constants();
  exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
  exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
  exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
  exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
  exports.isWindows = () => {
    if (typeof navigator !== "undefined" && navigator.platform) {
      const platform = navigator.platform.toLowerCase();
      return platform === "win32" || platform === "windows";
    }
    if (typeof process !== "undefined" && process.platform) {
      return process.platform === "win32";
    }
    return false;
  };
  exports.removeBackslashes = (str) => {
    return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
      return match === "\\" ? "" : match;
    });
  };
  exports.escapeLast = (input, char, lastIdx) => {
    const idx = input.lastIndexOf(char, lastIdx);
    if (idx === -1)
      return input;
    if (input[idx - 1] === "\\")
      return exports.escapeLast(input, char, idx - 1);
    return `${input.slice(0, idx)}\\${input.slice(idx)}`;
  };
  exports.removePrefix = (input, state = {}) => {
    let output = input;
    if (output.startsWith("./")) {
      output = output.slice(2);
      state.prefix = "./";
    }
    return output;
  };
  exports.wrapOutput = (input, state = {}, options = {}) => {
    const prepend = options.contains ? "" : "^";
    const append = options.contains ? "" : "$";
    let output = `${prepend}(?:${input})${append}`;
    if (state.negated === true) {
      output = `(?:^(?!${output}).*$)`;
    }
    return output;
  };
  exports.basename = (path, { windows } = {}) => {
    const segs = path.split(windows ? /[\\/]/ : "/");
    const last = segs[segs.length - 1];
    if (last === "") {
      return segs[segs.length - 2];
    }
    return last;
  };
});

// node_modules/picomatch/lib/scan.js
var require_scan = __commonJS(function(exports, module) {
  var utils = require_utils();
  var {
    CHAR_ASTERISK,
    CHAR_AT,
    CHAR_BACKWARD_SLASH,
    CHAR_COMMA,
    CHAR_DOT,
    CHAR_EXCLAMATION_MARK,
    CHAR_FORWARD_SLASH,
    CHAR_LEFT_CURLY_BRACE,
    CHAR_LEFT_PARENTHESES,
    CHAR_LEFT_SQUARE_BRACKET,
    CHAR_PLUS,
    CHAR_QUESTION_MARK,
    CHAR_RIGHT_CURLY_BRACE,
    CHAR_RIGHT_PARENTHESES,
    CHAR_RIGHT_SQUARE_BRACKET
  } = require_constants();
  var isPathSeparator = (code) => {
    return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
  };
  var depth = (token) => {
    if (token.isPrefix !== true) {
      token.depth = token.isGlobstar ? Infinity : 1;
    }
  };
  var scan = (input, options) => {
    const opts = options || {};
    const length = input.length - 1;
    const scanToEnd = opts.parts === true || opts.tokens === true || opts.scanToEnd === true;
    const slashes = [];
    const tokens = [];
    const parts = [];
    let str = input;
    let index = -1;
    let start = 0;
    let lastIndex = 0;
    let isBrace = false;
    let isBracket = false;
    let isGlob = false;
    let isExtglob = false;
    let isGlobstar = false;
    let braceEscaped = false;
    let backslashes = false;
    let negated = false;
    let negatedExtglob = false;
    let finished = false;
    let braces = 0;
    let prev;
    let code;
    let token = { value: "", depth: 0, isGlob: false };
    const eos = () => index >= length;
    const peek = () => str.charCodeAt(index + 1);
    const advance = () => {
      prev = code;
      return str.charCodeAt(++index);
    };
    while (index < length) {
      code = advance();
      let next;
      if (code === CHAR_BACKWARD_SLASH) {
        backslashes = token.backslashes = true;
        code = advance();
        if (code === CHAR_LEFT_CURLY_BRACE) {
          braceEscaped = true;
        }
        continue;
      }
      if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
        braces++;
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            advance();
            continue;
          }
          if (code === CHAR_LEFT_CURLY_BRACE) {
            braces++;
            continue;
          }
          if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
            isBrace = token.isBrace = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (braceEscaped !== true && code === CHAR_COMMA) {
            isBrace = token.isBrace = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) {
              continue;
            }
            break;
          }
          if (code === CHAR_RIGHT_CURLY_BRACE) {
            braces--;
            if (braces === 0) {
              braceEscaped = false;
              isBrace = token.isBrace = true;
              finished = true;
              break;
            }
          }
        }
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (code === CHAR_FORWARD_SLASH) {
        slashes.push(index);
        tokens.push(token);
        token = { value: "", depth: 0, isGlob: false };
        if (finished === true)
          continue;
        if (prev === CHAR_DOT && index === start + 1) {
          start += 2;
          continue;
        }
        lastIndex = index + 1;
        continue;
      }
      if (opts.noext !== true) {
        const isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK;
        if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;
          isExtglob = token.isExtglob = true;
          finished = true;
          if (code === CHAR_EXCLAMATION_MARK && index === start) {
            negatedExtglob = true;
          }
          if (scanToEnd === true) {
            let parens = 0;
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_BACKWARD_SLASH) {
                backslashes = token.backslashes = true;
                advance();
                continue;
              }
              if (code === CHAR_LEFT_PARENTHESES) {
                parens++;
                continue;
              }
              if (code === CHAR_RIGHT_PARENTHESES && --parens === 0) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }
      }
      if (code === CHAR_ASTERISK) {
        if (prev === CHAR_ASTERISK)
          isGlobstar = token.isGlobstar = true;
        isGlob = token.isGlob = true;
        finished = true;
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (code === CHAR_QUESTION_MARK) {
        isGlob = token.isGlob = true;
        finished = true;
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (code === CHAR_LEFT_SQUARE_BRACKET) {
        while (eos() !== true && (next = advance())) {
          if (next === CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            advance();
            continue;
          }
          if (next === CHAR_RIGHT_SQUARE_BRACKET) {
            isBracket = token.isBracket = true;
            isGlob = token.isGlob = true;
            finished = true;
            break;
          }
        }
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
      if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
        negated = token.negated = true;
        start++;
        continue;
      }
      if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        if (scanToEnd === true) {
          let parens = 1;
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }
            if (code === CHAR_LEFT_PARENTHESES) {
              parens++;
              continue;
            }
            if (code === CHAR_RIGHT_PARENTHESES && --parens === 0) {
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
      if (isGlob === true) {
        finished = true;
        if (scanToEnd === true) {
          continue;
        }
        break;
      }
    }
    if (opts.noext === true) {
      isExtglob = false;
      isGlob = false;
    }
    let base = str;
    let prefix = "";
    let glob = "";
    if (start > 0) {
      prefix = str.slice(0, start);
      str = str.slice(start);
      lastIndex -= start;
    }
    if (base && isGlob === true && lastIndex > 0) {
      base = str.slice(0, lastIndex);
      glob = str.slice(lastIndex);
    } else if (isGlob === true) {
      base = "";
      glob = str;
    } else {
      base = str;
    }
    if (base && base !== "" && base !== "/" && base !== str) {
      if (isPathSeparator(base.charCodeAt(base.length - 1))) {
        base = base.slice(0, -1);
      }
    }
    if (opts.unescape === true) {
      if (glob)
        glob = utils.removeBackslashes(glob);
      if (base && backslashes === true) {
        base = utils.removeBackslashes(base);
      }
    }
    const state = {
      prefix,
      input,
      start,
      base,
      glob,
      isBrace,
      isBracket,
      isGlob,
      isExtglob,
      isGlobstar,
      negated,
      negatedExtglob
    };
    if (opts.tokens === true) {
      state.maxDepth = 0;
      if (!isPathSeparator(code)) {
        tokens.push(token);
      }
      state.tokens = tokens;
    }
    if (opts.parts === true || opts.tokens === true) {
      let prevIndex;
      for (let idx = 0;idx < slashes.length; idx++) {
        const n = prevIndex !== undefined ? prevIndex + 1 : start;
        const i = slashes[idx];
        const value = input.slice(n, i);
        if (opts.tokens) {
          if (idx === 0 && start !== 0) {
            tokens[idx].isPrefix = true;
            tokens[idx].value = prefix;
          } else {
            tokens[idx].value = value;
          }
          depth(tokens[idx]);
          state.maxDepth += tokens[idx].depth;
        }
        if (i >= start) {
          parts.push(value);
          prevIndex = i;
        }
      }
      const n = prevIndex !== undefined ? prevIndex + 1 : start;
      const value = input.slice(n);
      parts.push(value);
      if (opts.tokens && prevIndex && prevIndex + 1 < input.length) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
      state.slashes = slashes;
      state.parts = parts;
    }
    return state;
  };
  module.exports = scan;
});

// node_modules/picomatch/lib/parse.js
var require_parse = __commonJS(function(exports, module) {
  var constants = require_constants();
  var utils = require_utils();
  var {
    MAX_LENGTH,
    POSIX_REGEX_SOURCE,
    REGEX_NON_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_BACKREF,
    REPLACEMENTS
  } = constants;
  var expandRange = (args, options) => {
    if (typeof options.expandRange === "function") {
      return options.expandRange(...args, options);
    }
    args.sort();
    const value = `[${args.join("-")}]`;
    try {
      new RegExp(value);
    } catch (ex) {
      return args.map((v) => utils.escapeRegex(v)).join("..");
    }
    return value;
  };
  var syntaxError = (type, char) => {
    return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
  };
  var splitTopLevel = (input) => {
    const parts = [];
    let bracket = 0;
    let paren = 0;
    let quote = 0;
    let value = "";
    let escaped = false;
    for (const ch of input) {
      if (escaped === true) {
        value += ch;
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        value += ch;
        escaped = true;
        continue;
      }
      if (ch === '"') {
        quote = quote === 1 ? 0 : 1;
        value += ch;
        continue;
      }
      if (quote === 0) {
        if (ch === "[") {
          bracket++;
        } else if (ch === "]" && bracket > 0) {
          bracket--;
        } else if (bracket === 0) {
          if (ch === "(") {
            paren++;
          } else if (ch === ")" && paren > 0) {
            paren--;
          } else if (ch === "|" && paren === 0) {
            parts.push(value);
            value = "";
            continue;
          }
        }
      }
      value += ch;
    }
    parts.push(value);
    return parts;
  };
  var isPlainBranch = (branch) => {
    let escaped = false;
    for (const ch of branch) {
      if (escaped === true) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (/[?*+@!()[\]{}]/.test(ch)) {
        return false;
      }
    }
    return true;
  };
  var normalizeSimpleBranch = (branch) => {
    let value = branch.trim();
    let changed = true;
    while (changed === true) {
      changed = false;
      if (/^@\([^\\()[\]{}|]+\)$/.test(value)) {
        value = value.slice(2, -1);
        changed = true;
      }
    }
    if (!isPlainBranch(value)) {
      return;
    }
    return value.replace(/\\(.)/g, "$1");
  };
  var hasRepeatedCharPrefixOverlap = (branches) => {
    const values = branches.map(normalizeSimpleBranch).filter(Boolean);
    for (let i = 0;i < values.length; i++) {
      for (let j = i + 1;j < values.length; j++) {
        const a = values[i];
        const b = values[j];
        const char = a[0];
        if (!char || a !== char.repeat(a.length) || b !== char.repeat(b.length)) {
          continue;
        }
        if (a === b || a.startsWith(b) || b.startsWith(a)) {
          return true;
        }
      }
    }
    return false;
  };
  var parseRepeatedExtglob = (pattern, requireEnd = true) => {
    if (pattern[0] !== "+" && pattern[0] !== "*" || pattern[1] !== "(") {
      return;
    }
    let bracket = 0;
    let paren = 0;
    let quote = 0;
    let escaped = false;
    for (let i = 1;i < pattern.length; i++) {
      const ch = pattern[i];
      if (escaped === true) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        quote = quote === 1 ? 0 : 1;
        continue;
      }
      if (quote === 1) {
        continue;
      }
      if (ch === "[") {
        bracket++;
        continue;
      }
      if (ch === "]" && bracket > 0) {
        bracket--;
        continue;
      }
      if (bracket > 0) {
        continue;
      }
      if (ch === "(") {
        paren++;
        continue;
      }
      if (ch === ")") {
        paren--;
        if (paren === 0) {
          if (requireEnd === true && i !== pattern.length - 1) {
            return;
          }
          return {
            type: pattern[0],
            body: pattern.slice(2, i),
            end: i
          };
        }
      }
    }
  };
  var buildCharClassStar = (chars) => {
    const source = chars.length === 1 ? utils.escapeRegex(chars[0]) : `[${chars.map((ch) => utils.escapeRegex(ch)).join("")}]`;
    return `${source}*`;
  };
  var getStarExtglobSequenceChars = (pattern) => {
    let index = 0;
    const chars = [];
    while (index < pattern.length) {
      const match = parseRepeatedExtglob(pattern.slice(index), false);
      if (!match || match.type !== "*") {
        return;
      }
      const branches = splitTopLevel(match.body).map((branch) => branch.trim());
      if (branches.length !== 1) {
        return;
      }
      const branch = normalizeSimpleBranch(branches[0]);
      if (!branch || branch.length !== 1) {
        return;
      }
      chars.push(branch);
      index += match.end + 1;
    }
    if (chars.length < 1) {
      return;
    }
    return chars;
  };
  var repeatedExtglobRecursion = (pattern) => {
    let depth = 0;
    let value = pattern.trim();
    let match = parseRepeatedExtglob(value);
    while (match) {
      depth++;
      value = match.body.trim();
      match = parseRepeatedExtglob(value);
    }
    return depth;
  };
  var analyzeRepeatedExtglob = (body, options) => {
    if (options.maxExtglobRecursion === false) {
      return { risky: false };
    }
    const max = typeof options.maxExtglobRecursion === "number" ? options.maxExtglobRecursion : constants.DEFAULT_MAX_EXTGLOB_RECURSION;
    const branches = splitTopLevel(body).map((branch) => branch.trim());
    if (branches.length > 1) {
      if (branches.some((branch) => branch === "") || branches.some((branch) => /^[*?]+$/.test(branch)) || hasRepeatedCharPrefixOverlap(branches)) {
        return { risky: true };
      }
    }
    const safeChars = [];
    let sawStarSequence = false;
    let combinable = true;
    for (const branch of branches) {
      const chars = getStarExtglobSequenceChars(branch);
      if (chars) {
        sawStarSequence = true;
        safeChars.push(...chars);
        continue;
      }
      const literal = normalizeSimpleBranch(branch);
      if (literal && literal.length === 1) {
        safeChars.push(literal);
        continue;
      }
      combinable = false;
      if (repeatedExtglobRecursion(branch) > max) {
        return { risky: true };
      }
    }
    if (sawStarSequence) {
      return combinable ? { risky: true, safeOutput: buildCharClassStar([...new Set(safeChars)]) } : { risky: true };
    }
    return { risky: false };
  };
  var parse = (input, options) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string");
    }
    input = REPLACEMENTS[input] || input;
    const opts = { ...options };
    const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    let len = input.length;
    if (len > max) {
      throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    }
    const bos = { type: "bos", value: "", output: opts.prepend || "" };
    const tokens = [bos];
    const capture = opts.capture ? "" : "?:";
    const PLATFORM_CHARS = constants.globChars(opts.windows);
    const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
    const {
      DOT_LITERAL,
      PLUS_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    } = PLATFORM_CHARS;
    const globstar = (opts) => {
      return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const nodot = opts.dot ? "" : NO_DOT;
    const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
    let star = opts.bash === true ? globstar(opts) : STAR;
    if (opts.capture) {
      star = `(${star})`;
    }
    if (typeof opts.noext === "boolean") {
      opts.noextglob = opts.noext;
    }
    const state = {
      input,
      index: -1,
      start: 0,
      dot: opts.dot === true,
      consumed: "",
      output: "",
      prefix: "",
      backtrack: false,
      negated: false,
      brackets: 0,
      braces: 0,
      parens: 0,
      quotes: 0,
      globstar: false,
      tokens
    };
    input = utils.removePrefix(input, state);
    len = input.length;
    const extglobs = [];
    const braces = [];
    const stack = [];
    let prev = bos;
    let value;
    const eos = () => state.index === len - 1;
    const peek = state.peek = (n = 1) => input[state.index + n];
    const advance = state.advance = () => input[++state.index] || "";
    const remaining = () => input.slice(state.index + 1);
    const consume = (value = "", num = 0) => {
      state.consumed += value;
      state.index += num;
    };
    const append = (token) => {
      state.output += token.output != null ? token.output : token.value;
      consume(token.value);
    };
    const negate = () => {
      let count = 1;
      while (peek() === "!" && (peek(2) !== "(" || peek(3) === "?")) {
        advance();
        state.start++;
        count++;
      }
      if (count % 2 === 0) {
        return false;
      }
      state.negated = true;
      state.start++;
      return true;
    };
    const increment = (type) => {
      state[type]++;
      stack.push(type);
    };
    const decrement = (type) => {
      state[type]--;
      stack.pop();
    };
    const push = (tok) => {
      if (prev.type === "globstar") {
        const isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
        const isExtglob = tok.extglob === true || extglobs.length && (tok.type === "pipe" || tok.type === "paren");
        if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "star";
          prev.value = "*";
          prev.output = star;
          state.output += prev.output;
        }
      }
      if (extglobs.length && tok.type !== "paren") {
        extglobs[extglobs.length - 1].inner += tok.value;
      }
      if (tok.value || tok.output)
        append(tok);
      if (prev && prev.type === "text" && tok.type === "text") {
        prev.output = (prev.output || prev.value) + tok.value;
        prev.value += tok.value;
        return;
      }
      tok.prev = prev;
      tokens.push(tok);
      prev = tok;
    };
    const extglobOpen = (type, value) => {
      const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: "" };
      token.prev = prev;
      token.parens = state.parens;
      token.output = state.output;
      token.startIndex = state.index;
      token.tokensIndex = tokens.length;
      const output = (opts.capture ? "(" : "") + token.open;
      increment("parens");
      push({ type, value, output: state.output ? "" : ONE_CHAR });
      push({ type: "paren", extglob: true, value: advance(), output });
      extglobs.push(token);
    };
    const extglobClose = (token) => {
      const literal = input.slice(token.startIndex, state.index + 1);
      const body = input.slice(token.startIndex + 2, state.index);
      const analysis = analyzeRepeatedExtglob(body, opts);
      if ((token.type === "plus" || token.type === "star") && analysis.risky) {
        const safeOutput = analysis.safeOutput ? (token.output ? "" : ONE_CHAR) + (opts.capture ? `(${analysis.safeOutput})` : analysis.safeOutput) : undefined;
        const open = tokens[token.tokensIndex];
        open.type = "text";
        open.value = literal;
        open.output = safeOutput || utils.escapeRegex(literal);
        for (let i = token.tokensIndex + 1;i < tokens.length; i++) {
          tokens[i].value = "";
          tokens[i].output = "";
          delete tokens[i].suffix;
        }
        state.output = token.output + open.output;
        state.backtrack = true;
        push({ type: "paren", extglob: true, value, output: "" });
        decrement("parens");
        return;
      }
      let output = token.close + (opts.capture ? ")" : "");
      let rest;
      if (token.type === "negate") {
        let extglobStar = star;
        if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
          extglobStar = globstar(opts);
        }
        if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
          output = token.close = `)$))${extglobStar}`;
        }
        if (token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
          const expression = parse(rest, { ...options, fastpaths: false }).output;
          output = token.close = `)${expression})${extglobStar})`;
        }
        if (token.prev.type === "bos") {
          state.negatedExtglob = true;
        }
      }
      push({ type: "paren", extglob: true, value, output });
      decrement("parens");
    };
    if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
      let backslashes = false;
      let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
        if (first === "\\") {
          backslashes = true;
          return m;
        }
        if (first === "?") {
          if (esc) {
            return esc + first + (rest ? QMARK.repeat(rest.length) : "");
          }
          if (index === 0) {
            return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
          }
          return QMARK.repeat(chars.length);
        }
        if (first === ".") {
          return DOT_LITERAL.repeat(chars.length);
        }
        if (first === "*") {
          if (esc) {
            return esc + first + (rest ? star : "");
          }
          return star;
        }
        return esc ? m : `\\${m}`;
      });
      if (backslashes === true) {
        if (opts.unescape === true) {
          output = output.replace(/\\/g, "");
        } else {
          output = output.replace(/\\+/g, (m) => {
            return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
          });
        }
      }
      if (output === input && opts.contains === true) {
        state.output = input;
        return state;
      }
      state.output = utils.wrapOutput(output, state, options);
      return state;
    }
    while (!eos()) {
      value = advance();
      if (value === "\x00") {
        continue;
      }
      if (value === "\\") {
        const next = peek();
        if (next === "/" && opts.bash !== true) {
          continue;
        }
        if (next === "." || next === ";") {
          continue;
        }
        if (!next) {
          value += "\\";
          push({ type: "text", value });
          continue;
        }
        const match = /^\\+/.exec(remaining());
        let slashes = 0;
        if (match && match[0].length > 2) {
          slashes = match[0].length;
          state.index += slashes;
          if (slashes % 2 !== 0) {
            value += "\\";
          }
        }
        if (opts.unescape === true) {
          value = advance();
        } else {
          value += advance();
        }
        if (state.brackets === 0) {
          push({ type: "text", value });
          continue;
        }
      }
      if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
        if (opts.posix !== false && value === ":") {
          const inner = prev.value.slice(1);
          if (inner.includes("[")) {
            prev.posix = true;
            if (inner.includes(":")) {
              const idx = prev.value.lastIndexOf("[");
              const pre = prev.value.slice(0, idx);
              const rest = prev.value.slice(idx + 2);
              const posix = POSIX_REGEX_SOURCE[rest];
              if (posix) {
                prev.value = pre + posix;
                state.backtrack = true;
                advance();
                if (!bos.output && tokens.indexOf(prev) === 1) {
                  bos.output = ONE_CHAR;
                }
                continue;
              }
            }
          }
        }
        if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
          value = `\\${value}`;
        }
        if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
          value = `\\${value}`;
        }
        if (opts.posix === true && value === "!" && prev.value === "[") {
          value = "^";
        }
        prev.value += value;
        append({ value });
        continue;
      }
      if (state.quotes === 1 && value !== '"') {
        value = utils.escapeRegex(value);
        prev.value += value;
        append({ value });
        continue;
      }
      if (value === '"') {
        state.quotes = state.quotes === 1 ? 0 : 1;
        if (opts.keepQuotes === true) {
          push({ type: "text", value });
        }
        continue;
      }
      if (value === "(") {
        increment("parens");
        push({ type: "paren", value });
        continue;
      }
      if (value === ")") {
        if (state.parens === 0 && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError("opening", "("));
        }
        const extglob = extglobs[extglobs.length - 1];
        if (extglob && state.parens === extglob.parens + 1) {
          extglobClose(extglobs.pop());
          continue;
        }
        push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
        decrement("parens");
        continue;
      }
      if (value === "[") {
        if (opts.nobracket === true || !remaining().includes("]")) {
          if (opts.nobracket !== true && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("closing", "]"));
          }
          value = `\\${value}`;
        } else {
          increment("brackets");
        }
        push({ type: "bracket", value });
        continue;
      }
      if (value === "]") {
        if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
          push({ type: "text", value, output: `\\${value}` });
          continue;
        }
        if (state.brackets === 0) {
          if (opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "["));
          }
          push({ type: "text", value, output: `\\${value}` });
          continue;
        }
        decrement("brackets");
        const prevValue = prev.value.slice(1);
        if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
          value = `/${value}`;
        }
        prev.value += value;
        append({ value });
        if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
          continue;
        }
        const escaped = utils.escapeRegex(prev.value);
        state.output = state.output.slice(0, -prev.value.length);
        if (opts.literalBrackets === true) {
          state.output += escaped;
          prev.value = escaped;
          continue;
        }
        prev.value = `(${capture}${escaped}|${prev.value})`;
        state.output += prev.value;
        continue;
      }
      if (value === "{" && opts.nobrace !== true) {
        increment("braces");
        const open = {
          type: "brace",
          value,
          output: "(",
          outputIndex: state.output.length,
          tokensIndex: state.tokens.length
        };
        braces.push(open);
        push(open);
        continue;
      }
      if (value === "}") {
        const brace = braces[braces.length - 1];
        if (opts.nobrace === true || !brace) {
          push({ type: "text", value, output: value });
          continue;
        }
        let output = ")";
        if (brace.dots === true) {
          const arr = tokens.slice();
          const range = [];
          for (let i = arr.length - 1;i >= 0; i--) {
            tokens.pop();
            if (arr[i].type === "brace") {
              break;
            }
            if (arr[i].type !== "dots") {
              range.unshift(arr[i].value);
            }
          }
          output = expandRange(range, opts);
          state.backtrack = true;
        }
        if (brace.comma !== true && brace.dots !== true) {
          const out = state.output.slice(0, brace.outputIndex);
          const toks = state.tokens.slice(brace.tokensIndex);
          brace.value = brace.output = "\\{";
          value = output = "\\}";
          state.output = out;
          for (const t of toks) {
            state.output += t.output || t.value;
          }
        }
        push({ type: "brace", value, output });
        decrement("braces");
        braces.pop();
        continue;
      }
      if (value === "|") {
        if (extglobs.length > 0) {
          extglobs[extglobs.length - 1].conditions++;
        }
        push({ type: "text", value });
        continue;
      }
      if (value === ",") {
        let output = value;
        const brace = braces[braces.length - 1];
        if (brace && stack[stack.length - 1] === "braces") {
          brace.comma = true;
          output = "|";
        }
        push({ type: "comma", value, output });
        continue;
      }
      if (value === "/") {
        if (prev.type === "dot" && state.index === state.start + 1) {
          state.start = state.index + 1;
          state.consumed = "";
          state.output = "";
          tokens.pop();
          prev = bos;
          continue;
        }
        push({ type: "slash", value, output: SLASH_LITERAL });
        continue;
      }
      if (value === ".") {
        if (state.braces > 0 && prev.type === "dot") {
          if (prev.value === ".")
            prev.output = DOT_LITERAL;
          const brace = braces[braces.length - 1];
          prev.type = "dots";
          prev.output += value;
          prev.value += value;
          brace.dots = true;
          continue;
        }
        if (state.braces + state.parens === 0 && prev.type !== "bos" && prev.type !== "slash") {
          push({ type: "text", value, output: DOT_LITERAL });
          continue;
        }
        push({ type: "dot", value, output: DOT_LITERAL });
        continue;
      }
      if (value === "?") {
        const isGroup = prev && prev.value === "(";
        if (!isGroup && opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("qmark", value);
          continue;
        }
        if (prev && prev.type === "paren") {
          const next = peek();
          let output = value;
          if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/<([!=]|\w+>)/.test(remaining())) {
            output = `\\${value}`;
          }
          push({ type: "text", value, output });
          continue;
        }
        if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
          push({ type: "qmark", value, output: QMARK_NO_DOT });
          continue;
        }
        push({ type: "qmark", value, output: QMARK });
        continue;
      }
      if (value === "!") {
        if (opts.noextglob !== true && peek() === "(") {
          if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
            extglobOpen("negate", value);
            continue;
          }
        }
        if (opts.nonegate !== true && state.index === 0) {
          negate();
          continue;
        }
      }
      if (value === "+") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("plus", value);
          continue;
        }
        if (prev && prev.value === "(" || opts.regex === false) {
          push({ type: "plus", value, output: PLUS_LITERAL });
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace") || state.parens > 0) {
          push({ type: "plus", value });
          continue;
        }
        push({ type: "plus", value: PLUS_LITERAL });
        continue;
      }
      if (value === "@") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          push({ type: "at", extglob: true, value, output: "" });
          continue;
        }
        push({ type: "text", value });
        continue;
      }
      if (value !== "*") {
        if (value === "$" || value === "^") {
          value = `\\${value}`;
        }
        const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
        if (match) {
          value += match[0];
          state.index += match[0].length;
        }
        push({ type: "text", value });
        continue;
      }
      if (prev && (prev.type === "globstar" || prev.star === true)) {
        prev.type = "star";
        prev.star = true;
        prev.value += value;
        prev.output = star;
        state.backtrack = true;
        state.globstar = true;
        consume(value);
        continue;
      }
      let rest = remaining();
      if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
        extglobOpen("star", value);
        continue;
      }
      if (prev.type === "star") {
        if (opts.noglobstar === true) {
          consume(value);
          continue;
        }
        const prior = prev.prev;
        const before = prior.prev;
        const isStart = prior.type === "slash" || prior.type === "bos";
        const afterStar = before && (before.type === "star" || before.type === "globstar");
        if (opts.bash === true && (!isStart || rest[0] && rest[0] !== "/")) {
          push({ type: "star", value, output: "" });
          continue;
        }
        const isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
        const isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
        if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
          push({ type: "star", value, output: "" });
          continue;
        }
        while (rest.slice(0, 3) === "/**") {
          const after = input[state.index + 4];
          if (after && after !== "/") {
            break;
          }
          rest = rest.slice(3);
          consume("/**", 3);
        }
        const isEnd = eos() || state.parens > 0 && rest === ")".repeat(state.parens) && !extglobs.some((extglob) => extglob.type === "negate");
        if (prior.type === "bos" && eos()) {
          prev.type = "globstar";
          prev.value += value;
          prev.output = globstar(opts);
          state.output = prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && isEnd) {
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = `(?:${prior.output}`;
          prev.type = "globstar";
          prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)");
          prev.value += value;
          state.globstar = true;
          state.output += prior.output + prev.output;
          consume(value);
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && rest[0] === "/") {
          const end = rest[1] !== undefined ? "|$" : "";
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = `(?:${prior.output}`;
          prev.type = "globstar";
          prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
          prev.value += value;
          state.output += prior.output + prev.output;
          state.globstar = true;
          consume(value + advance());
          push({ type: "slash", value: "/", output: "" });
          continue;
        }
        if (prior.type === "bos" && rest[0] === "/") {
          prev.type = "globstar";
          prev.value += value;
          prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
          state.output = prev.output;
          state.globstar = true;
          consume(value + advance());
          push({ type: "slash", value: "/", output: "" });
          continue;
        }
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = "globstar";
        prev.output = globstar(opts);
        prev.value += value;
        state.output += prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }
      const token = { type: "star", value, output: star };
      if (opts.bash === true) {
        token.output = ".*?";
        if (prev.type === "bos" || prev.type === "slash") {
          token.output = nodot + token.output;
        }
        push(token);
        continue;
      }
      if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
        token.output = value;
        push(token);
        continue;
      }
      if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
        if (prev.type === "dot") {
          state.output += NO_DOT_SLASH;
          prev.output += NO_DOT_SLASH;
        } else if (opts.dot === true) {
          state.output += NO_DOTS_SLASH;
          prev.output += NO_DOTS_SLASH;
        } else {
          state.output += nodot;
          prev.output += nodot;
        }
        if (peek() !== "*") {
          state.output += ONE_CHAR;
          prev.output += ONE_CHAR;
        }
      }
      push(token);
    }
    while (state.brackets > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", "]"));
      state.output = utils.escapeLast(state.output, "[");
      decrement("brackets");
    }
    while (state.parens > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", ")"));
      state.output = utils.escapeLast(state.output, "(");
      decrement("parens");
    }
    while (state.braces > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", "}"));
      state.output = utils.escapeLast(state.output, "{");
      decrement("braces");
    }
    if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
      push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
    }
    if (state.backtrack === true) {
      state.output = "";
      for (const token of state.tokens) {
        state.output += token.output != null ? token.output : token.value;
        if (token.suffix) {
          state.output += token.suffix;
        }
      }
    }
    return state;
  };
  parse.fastpaths = (input, options) => {
    const opts = { ...options };
    const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    const len = input.length;
    if (len > max) {
      throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    }
    input = REPLACEMENTS[input] || input;
    const {
      DOT_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOTS_SLASH,
      STAR,
      START_ANCHOR
    } = constants.globChars(opts.windows);
    const nodot = opts.dot ? NO_DOTS : NO_DOT;
    const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
    const capture = opts.capture ? "" : "?:";
    const state = { negated: false, prefix: "" };
    let star = opts.bash === true ? ".*?" : STAR;
    if (opts.capture) {
      star = `(${star})`;
    }
    const globstar = (opts) => {
      if (opts.noglobstar === true)
        return star;
      return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const create = (str) => {
      switch (str) {
        case "*":
          return `${nodot}${ONE_CHAR}${star}`;
        case ".*":
          return `${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*.*":
          return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*/*":
          return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
        case "**":
          return nodot + globstar(opts);
        case "**/*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
        case "**/*.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "**/.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
        default: {
          const match = /^(.*?)\.(\w+)$/.exec(str);
          if (!match)
            return;
          const source = create(match[1]);
          if (!source)
            return;
          return source + DOT_LITERAL + match[2];
        }
      }
    };
    const output = utils.removePrefix(input, state);
    let source = create(output);
    if (source && opts.strictSlashes !== true) {
      source += `${SLASH_LITERAL}?`;
    }
    return source;
  };
  module.exports = parse;
});

// node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS(function(exports, module) {
  var scan = require_scan();
  var parse = require_parse();
  var utils = require_utils();
  var constants = require_constants();
  var isObject = (val) => val && typeof val === "object" && !Array.isArray(val);
  var picomatch = (glob, options, returnState = false) => {
    if (Array.isArray(glob)) {
      const fns = glob.map((input) => picomatch(input, options, returnState));
      const arrayMatcher = (str) => {
        for (const isMatch of fns) {
          const state = isMatch(str);
          if (state)
            return state;
        }
        return false;
      };
      return arrayMatcher;
    }
    const isState = isObject(glob) && glob.tokens && glob.input;
    if (glob === "" || typeof glob !== "string" && !isState) {
      throw new TypeError("Expected pattern to be a non-empty string");
    }
    const opts = options || {};
    const posix = opts.windows;
    const regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, false, true);
    const state = regex.state;
    delete regex.state;
    let isIgnored = () => false;
    if (opts.ignore) {
      const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
      isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
    }
    const matcher = (input, returnObject = false) => {
      const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
      const result = { glob, state, regex, posix, input, output, match, isMatch };
      if (typeof opts.onResult === "function") {
        opts.onResult(result);
      }
      if (isMatch === false) {
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (isIgnored(input)) {
        if (typeof opts.onIgnore === "function") {
          opts.onIgnore(result);
        }
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (typeof opts.onMatch === "function") {
        opts.onMatch(result);
      }
      return returnObject ? result : true;
    };
    if (returnState) {
      matcher.state = state;
    }
    return matcher;
  };
  picomatch.test = (input, regex, options, { glob, posix } = {}) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected input to be a string");
    }
    if (input === "") {
      return { isMatch: false, output: "" };
    }
    const opts = options || {};
    const format = opts.format || (posix ? utils.toPosixSlashes : null);
    let match = input === glob;
    let output = match && format ? format(input) : input;
    if (match === false) {
      output = format ? format(input) : input;
      match = output === glob;
    }
    if (match === false || opts.capture === true) {
      if (opts.matchBase === true || opts.basename === true) {
        match = picomatch.matchBase(input, regex, options, posix);
      } else {
        match = regex.exec(output);
      }
    }
    return { isMatch: Boolean(match), match, output };
  };
  picomatch.matchBase = (input, glob, options, posix = options && options.windows) => {
    const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
    return regex.test(utils.basename(input, { windows: posix }));
  };
  picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
  picomatch.parse = (pattern, options) => {
    if (Array.isArray(pattern))
      return pattern.map((p) => picomatch.parse(p, options));
    return parse(pattern, { ...options, fastpaths: false });
  };
  picomatch.scan = (input, options) => scan(input, options);
  picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
    if (returnOutput === true) {
      return state.output;
    }
    const opts = options || {};
    const prepend = opts.contains ? "" : "^";
    const append = opts.contains ? "" : "$";
    let source = `${prepend}(?:${state.output})${append}`;
    if (state && state.negated === true) {
      source = `^(?!${source}).*$`;
    }
    const regex = picomatch.toRegex(source, options);
    if (returnState === true) {
      regex.state = state;
    }
    return regex;
  };
  picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
    if (!input || typeof input !== "string") {
      throw new TypeError("Expected a non-empty string");
    }
    let parsed = { negated: false, fastpaths: true };
    if (options.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
      parsed.output = parse.fastpaths(input, options);
    }
    if (!parsed.output) {
      parsed = parse(input, options);
    }
    return picomatch.compileRe(parsed, options, returnOutput, returnState);
  };
  picomatch.toRegex = (source, options) => {
    try {
      const opts = options || {};
      return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
    } catch (err) {
      if (options && options.debug === true)
        throw err;
      return /$^/;
    }
  };
  picomatch.constants = constants;
  module.exports = picomatch;
});

// node_modules/picomatch/index.js
var require_picomatch2 = __commonJS(function(exports, module) {
  var pico = require_picomatch();
  var utils = require_utils();
  function picomatch(glob, options, returnState = false) {
    if (options && (options.windows === null || options.windows === undefined)) {
      options = { ...options, windows: utils.isWindows() };
    }
    return pico(glob, options, returnState);
  }
  Object.assign(picomatch, pico);
  module.exports = picomatch;
});

// src/cli.ts
import { spawnSync } from "node:child_process";
import { readFileSync as readFileSync12 } from "node:fs";
import { homedir } from "node:os";
import { join as join16 } from "node:path";
import { fileURLToPath } from "node:url";

// src/cli/run.ts
import { statSync as statSync6 } from "node:fs";
import { resolve as resolve2 } from "node:path";

// src/core/basics.ts
function byCodeUnit(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
function plural(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}
var ENCODER = new TextEncoder;
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// node_modules/yaml/dist/index.js
var composer = require_composer();
var Document = require_Document();
var Schema = require_Schema();
var errors = require_errors();
var Alias = require_Alias();
var identity = require_identity();
var Pair = require_Pair();
var Scalar = require_Scalar();
var YAMLMap = require_YAMLMap();
var YAMLSeq = require_YAMLSeq();
var cst = require_cst();
var lexer = require_lexer();
var lineCounter = require_line_counter();
var parser = require_parser();
var publicApi = require_public_api();
var visit = require_visit();
var $Composer = composer.Composer;
var $Document = Document.Document;
var $Schema = Schema.Schema;
var $YAMLError = errors.YAMLError;
var $YAMLParseError = errors.YAMLParseError;
var $YAMLWarning = errors.YAMLWarning;
var $Alias = Alias.Alias;
var $isAlias = identity.isAlias;
var $isCollection = identity.isCollection;
var $isDocument = identity.isDocument;
var $isMap = identity.isMap;
var $isNode = identity.isNode;
var $isPair = identity.isPair;
var $isScalar = identity.isScalar;
var $isSeq = identity.isSeq;
var $Pair = Pair.Pair;
var $Scalar = Scalar.Scalar;
var $YAMLMap = YAMLMap.YAMLMap;
var $YAMLSeq = YAMLSeq.YAMLSeq;
var $Lexer = lexer.Lexer;
var $LineCounter = lineCounter.LineCounter;
var $Parser = parser.Parser;
var $parse = publicApi.parse;
var $parseAllDocuments = publicApi.parseAllDocuments;
var $parseDocument = publicApi.parseDocument;
var $stringify = publicApi.stringify;
var $visit = visit.visit;
var $visitAsync = visit.visitAsync;

// node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function joinValues(array, separator = "|") {
  return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}

class Cached {
  constructor(getter) {
    this._getter = getter;
    this._value = undefined;
  }
  get value() {
    const getter = this._getter;
    if (getter !== undefined) {
      this._value = getter();
      this._getter = undefined;
    }
    return this._value;
  }
}
function cached(getter) {
  return new Cached(getter);
}
function nullish(input) {
  return input === null || input === undefined;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function rawShape(def) {
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
  return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
  Object.defineProperty(target, key, {
    get() {
      const value = getter();
      assignProp(this, key, value);
      return value;
    },
    enumerable: true,
    configurable: true
  });
}
function putProp(target, key, value) {
  if (key in target)
    assignProp(target, key, value);
  else
    target[key] = value;
}
function mirrorShape(target, source, keys, wrap) {
  const raw = sourceShape(source);
  for (const key of keys) {
    const desc = Object.getOwnPropertyDescriptor(raw, key);
    if (!desc.enumerable)
      continue;
    if (desc.get) {
      deferProp(target, key, () => {
        const value = source._zod.def.shape[key];
        return wrap ? wrap(value, key) : value;
      });
    } else
      putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
  }
}
function mirrorProps(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    const desc = Object.getOwnPropertyDescriptor(source, key);
    if (!desc.enumerable)
      continue;
    if (desc.get)
      deferProp(target, key, () => source[key]);
    else
      putProp(target, key, desc.value);
  }
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === undefined)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== undefined) {
    if (params?.error !== undefined)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin !== undefined && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = /* @__PURE__ */ (() => ({
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-340282346638528860000000000000000000000, 340282346638528860000000000000000000000],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))();
var BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const newShape = {};
  mirrorShape(newShape, schema, maskedKeys(schema, mask));
  return clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
}
function maskedKeys(schema, mask) {
  const raw = sourceShape(schema);
  const keys = [];
  for (const key of Reflect.ownKeys(mask)) {
    if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) {
      throw new Error(`Unrecognized key: "${String(key)}"`);
    }
    if (mask[key])
      keys.push(key);
  }
  return keys;
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const omitted = new Set(maskedKeys(schema, mask));
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
  return clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = sourceShape(schema);
    for (const key of Reflect.ownKeys(shape)) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== undefined) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
  mirrorProps(newShape, shape);
  return newShape;
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge(a, b) {
  if (!b?._zod?.def) {
    throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  }
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const newShape = {};
  mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a)));
  mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
  const def = mergeDefs(a._zod.def, {
    shape: newShape,
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
function partial(Class, schema, mask, name = "partial") {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
  }
  const selected = mask ? new Set(maskedKeys(schema, mask)) : undefined;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({ type: "optional", innerType: value })));
  return clone(schema, mergeDefs(schema._zod.def, { shape: newShape, checks: [] }));
}
function required(Class, schema, mask) {
  const selected = mask ? new Set(maskedKeys(schema, mask)) : undefined;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({ type: "nonoptional", innerType: value }));
  return clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex;i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a;
    (_a = iss).path ?? (_a.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function attachSchema(issues, start, inst) {
  var _a;
  for (let i = start;i < issues.length; i++) {
    (_a = issues[i]).schema ?? (_a.schema = inst);
  }
}
function finalizeIssue(iss, ctx, config) {
  var _a;
  const traits = iss.inst?._zod?.traits;
  if (traits?.has("$ZodType")) {
    if (traits.has("$ZodCheck"))
      (_a = iss).schema ?? (_a.schema = iss.inst);
    else
      iss.schema = iss.inst;
  }
  const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : undefined;
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
  const full = {};
  for (const k of Object.keys(iss)) {
    if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__")
      continue;
    full[k] = iss[k];
  }
  full.path ?? (full.path = []);
  full.message = message;
  if (ctx?.reportInput) {
    full.input = iss.input;
  }
  return full;
}
var highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
  const units = str.length;
  if (!highSurrogate.test(str))
    return units;
  let count = units;
  for (let i = 0;i < units - 1; i++) {
    if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
      count--;
      i++;
    }
  }
  return count;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function parsedType(data) {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "nan" : "number";
    }
    case "object": {
      if (data === null) {
        return "null";
      }
      if (Array.isArray(data)) {
        return "array";
      }
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
        return obj.constructor.name;
      }
    }
  }
  return t;
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
function members(proto, table) {
  for (const key in table) {
    const desc = Object.getOwnPropertyDescriptor(table, key);
    if (desc.get)
      Object.defineProperty(proto, key, { ...desc, enumerable: false });
    else
      defineBound(proto, key, desc.value);
  }
}
function own(inst, key, value, enumerable = true) {
  Object.defineProperty(inst, key, { configurable: true, writable: true, enumerable, value });
  return value;
}
function hide(inst, key, value) {
  return own(inst, key, value, false);
}
function derived(computes, table) {
  for (const key in computes) {
    const compute = computes[key];
    Object.defineProperty(table, key, {
      configurable: true,
      enumerable: true,
      get() {
        return own(this, key, compute(this));
      },
      set(value) {
        own(this, key, value);
      }
    });
  }
  return table;
}
function defineBound(proto, key, fn) {
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      return this == null ? fn : own(this, key, fn.bind(this));
    },
    set(value) {
      own(this, key, value);
    }
  });
}
function claim(inst, sentinel) {
  const proto = Object.getPrototypeOf(inst);
  return sentinel in proto ? undefined : proto;
}
var installing;
var broke = false;
var breaker = {
  configurable: true,
  get() {
    broke = true;
    return;
  }
};
function defineLazyInternal(inst, key, compute) {
  const proto = Object.getPrototypeOf(inst._zod);
  if (key in proto && installing !== inst._zod) {
    installing = undefined;
    return;
  }
  installing = inst._zod;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      Object.defineProperty(this, key, breaker);
      const outer = broke;
      broke = false;
      try {
        const value = compute(this);
        if (broke)
          delete this[key];
        else
          Object.defineProperty(this, key, { configurable: true, writable: true, value });
        broke = broke || outer;
        return value;
      } catch (err) {
        delete this[key];
        broke = broke || outer;
        throw err;
      }
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: true, writable: true, value });
    }
  });
}
function installLazyProp(inst, key, make, enumerable) {
  const proto = claim(inst, key);
  if (!proto)
    return;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      const desc = { configurable: true, writable: true, enumerable, value: undefined };
      Object.defineProperty(this, key, desc);
      desc.value = make(this);
      Object.defineProperty(this, key, desc);
      return desc.value;
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: true, writable: true, enumerable, value });
    }
  });
}
var CONSTANT_CATCH = "~constantCatch";
function constantCatch(value) {
  const fn = () => value;
  fn[CONSTANT_CATCH] = true;
  return fn;
}

// node_modules/zod/v4/core/core.js
var _a;
var _zodDesc = { value: undefined, enumerable: false };
var _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
  const E = _E;
  if (E) {
    const saved = E.stackTraceLimit;
    if (typeof saved === "number") {
      try {
        E.stackTraceLimit = 0;
      } catch {
        _E = null;
        return new Definition;
      }
      try {
        return new Definition;
      } finally {
        E.stackTraceLimit = saved;
      }
    }
  }
  return new Definition;
}
function $constructor(name, initializer, proto, params) {
  const zodProto = {};
  function Internals(def) {
    this.def = def;
    this.constr = _;
    this.traits = new Set;
  }
  Internals.prototype = zodProto;
  const protoMembers = proto;
  const initialized = protoMembers && new WeakSet;
  function init(inst, def) {
    if (!inst._zod) {
      _zodDesc.value = new Internals(def);
      try {
        Object.defineProperty(inst, "_zod", _zodDesc);
      } finally {
        _zodDesc.value = undefined;
      }
    } else if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer(inst, def);
    if (initialized) {
      const own = Object.getPrototypeOf(inst);
      const ctorProto = inst._zod.constr.prototype;
      let up = own;
      while (up && up !== ctorProto)
        up = Object.getPrototypeOf(up);
      const target = up ?? own;
      if (!initialized.has(target)) {
        initialized.add(target);
        members(target, protoMembers);
      }
    }
    const proto = _.prototype;
    for (const k in proto) {
      if (!Object.prototype.hasOwnProperty.call(proto, k))
        continue;
      if (!(k in inst)) {
        inst[k] = proto[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;

  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    const inst = params?.Parent ? newError(Definition) : this;
    init(inst, def);
    const deferred = inst._zod.deferred;
    if (deferred) {
      for (const fn of deferred) {
        fn();
      }
      inst._zod.deferred = undefined;
    }
    const pp = globalThis.__zod_globalConfig?.postProcessor;
    if (pp)
      pp(inst);
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
class $ZodAsyncError extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
}

class $ZodEncodeError extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
}
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}
// node_modules/zod/v4/core/errors.js
function _getMessage() {
  const internals = this._zod;
  internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
  return internals.message;
}
function _setMessage(value) {
  this._zod.message = value;
}
var _messageDesc = {
  get: _getMessage,
  set: _setMessage,
  enumerable: true,
  configurable: true
};
var _issuesDesc = { value: undefined, enumerable: false };
var _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  _issuesDesc.value = def;
  Object.defineProperty(inst, "issues", _issuesDesc);
  _issuesDesc.value = undefined;
  Object.defineProperty(inst, "message", _messageDesc);
  const proto = Object.getPrototypeOf(inst);
  if (!_installedToString.has(proto)) {
    _installedToString.add(proto);
    Object.defineProperty(proto, "toString", {
      configurable: true,
      enumerable: false,
      get() {
        const value = () => this.message;
        Object.defineProperty(this, "toString", { value, configurable: true, writable: true });
        return value;
      },
      set(value) {
        Object.defineProperty(this, "toString", { value, configurable: true, writable: true });
      }
    });
  }
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, undefined, {
  Parent: Error
});
function node(obj, key, make) {
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    if (key === "__proto__") {
      Object.defineProperty(obj, key, { value: make(), writable: true, enumerable: true, configurable: true });
    } else {
      obj[key] = make();
    }
  }
  return obj[key];
}
function flattenError(error, mapper = (issue) => issue.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error.issues) {
    if (sub.path.length > 0) {
      node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue) => issue.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error, path = []) => {
    for (const issue of error.issues) {
      if (issue.code === "invalid_union" && issue.errors.length) {
        issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
      } else if (issue.code === "invalid_key") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else if (issue.code === "invalid_element") {
        processError({ issues: issue.issues }, [...path, ...issue.path]);
      } else {
        const fullpath = [...path, ...issue.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (el === "_errors") {
              if (terminal)
                curr._errors.push(mapper(issue));
              i++;
              continue;
            }
            if (!Object.prototype.hasOwnProperty.call(curr, el)) {
              Object.defineProperty(curr, el, {
                value: { _errors: [] },
                enumerable: true,
                writable: true,
                configurable: true
              });
            }
            const node = curr[el];
            if (terminal) {
              node._errors.push(mapper(issue));
            }
            curr = node;
            i++;
          }
        }
      }
    }
  };
  processError(error);
  return fieldErrors;
}

// node_modules/zod/v4/core/parse.js
function finalizeParams(callee, params) {
  return { callee: params?.callee ?? callee, Err: params?.Err };
}
var _parse = (_Err) => {
  const fn = (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError;
    }
    if (result.issues.length) {
      const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, _params?.callee ?? fn);
      throw e;
    }
    return result.value;
  };
  return fn;
};
var _parseAsync = (_Err) => {
  const fn = async (schema, value, _ctx, params) => {
    const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, params?.callee ?? fn);
      throw e;
    }
    return result.value;
  };
  return fn;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: true, data: result.value };
};
function failure(Err, issues, ctx) {
  let error;
  return {
    success: false,
    get error() {
      if (!error) {
        error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
        issues = undefined;
        ctx = undefined;
      }
      return error;
    },
    set error(e) {
      error = e;
      issues = undefined;
      ctx = undefined;
    }
  };
}
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: true, data: result.value };
};
var COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
var COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
var validate = (schema, value, _ctx) => {
  const validator = schema._zod.bag.validator;
  if (validator !== undefined) {
    if (validator(value) !== COMPILE_INVALID)
      return true;
    if (validator.definite === true && _ctx === undefined)
      return false;
  }
  return validateFallback(schema, value, _ctx);
};
function validateFallback(schema, value, _ctx) {
  const ctx = _ctx ? { ..._ctx, async: false, abortEarly: true } : { async: false, abortEarly: true };
  const fallbackRun = schema._zod.bag.fallbackRun;
  let result;
  if (fallbackRun) {
    ctx[COMPILE_FALLBACK] = true;
    result = fallbackRun({ value, issues: [] }, ctx);
  } else {
    result = schema._zod.run({ value, issues: [] }, ctx);
  }
  if (result instanceof Promise) {
    throw new $ZodAsyncError;
  }
  return result.issues.length === 0;
}
var validateAsync = async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true, abortEarly: true } : { async: true, abortEarly: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length === 0;
};
var _encode = (_Err) => {
  const parse = _parse(_Err);
  const fn = (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return parse(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decode = (_Err) => {
  const parse = _parse(_Err);
  const fn = (schema, value, _ctx, _params) => {
    return parse(schema, value, _ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _encodeAsync = (_Err) => {
  const parseAsync = _parseAsync(_Err);
  const fn = async (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decodeAsync = (_Err) => {
  const parseAsync = _parseAsync(_Err);
  const fn = async (schema, value, _ctx, _params) => {
    return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};
// node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
  return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = (version) => {
  if (!version)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
function anchor(source) {
  return new RegExp(`^${source}$`);
}
var date = /* @__PURE__ */ anchor(dateSource);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const opts = ["Z"];
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const qualified = `${timeSource({ precision: args.precision, seconds: true })}(?:${opts.join("|")})`;
  const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
  return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var anyString = /^[\s\S]{0,}$/;
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;

// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a = inst._zod).onattach ?? (_a.onattach = []);
});
var _whenHasLength = (payload) => {
  const val = payload.value;
  return !nullish(val) && val.length !== undefined;
};
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units > def.maximum ? codePointLength(input) : units;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a;
  $ZodCheck.init(inst, def);
  (_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a, _b;
  $ZodCheck.init(inst, def);
  if (def.pattern)
    (_a = inst._zod).check ?? (_a.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
  def.pattern = pattern;
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern);
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
class Doc {
  constructor(args = [], closed = {}) {
    this.content = [];
    this.indent = 0;
    this.args = args;
    this.closed = closed;
  }
  indented(fn) {
    this.indent += 1;
    try {
      fn(this);
    } finally {
      this.indent -= 1;
    }
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split(`
`).filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const content = this?.content ?? [``];
    const factory = new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${content.join(`
`)}
};`);
    return factory(...Object.values(this.closed));
  }
}

// node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 6,
  patch: 5
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const defChecks = inst._zod.def.checks;
  const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks, ctx) => {
      if (payload.memo)
        return payload;
      let isAborted = aborted(payload);
      let asyncResult;
      for (const ch of checks) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError;
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            attachSchema(payload.issues, currLen, inst);
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          attachSchema(payload.issues, currLen, inst);
          if (!isAborted)
            isAborted = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary) => {
            return handleCanaryResult(canary, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError;
        return result.then((result) => runChecks(result, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
}, {
  get "~standard"() {
    return hide(this, "~standard", standardProps(this));
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  }
});
var toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
async function validateAsync2(inst, value) {
  const ctx = { async: true };
  return toStandardResult(await inst._zod.run({ value, issues: [] }, ctx), ctx);
}
function standardProps(inst) {
  return {
    validate: (value) => {
      const ctx = { async: false };
      try {
        const r = inst._zod.run({ value, issues: [] }, ctx);
        if (!(r instanceof Promise))
          return toStandardResult(r, ctx);
      } catch (_) {}
      return validateAsync2(inst, value);
    },
    vendor: "zod",
    version: 1
  };
}
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = def.pattern ?? anyString;
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_) {}
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === undefined)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var URL_BAD_FORMAT = 1;
var URL_UNPARSEABLE = 2;
function canParseURL(input) {
  try {
    if (typeof URL !== "undefined" && typeof URL.canParse === "function")
      return URL.canParse(input);
    new URL(input);
    return true;
  } catch {
    return false;
  }
}
function validateURL(trimmed, def) {
  if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) {
    return canParseURL(trimmed) || URL_UNPARSEABLE;
  }
  return parseURLObject(trimmed, def);
}
function parseURLObject(trimmed, def) {
  if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) {
    return URL_BAD_FORMAT;
  }
  try {
    if (typeof URL !== "undefined") {
      const URLStatic = URL;
      if (typeof URLStatic.parse === "function")
        return URLStatic.parse(trimmed) ?? URL_UNPARSEABLE;
    }
    return new URL(trimmed);
  } catch {
    return URL_UNPARSEABLE;
  }
}
var asciiTabOrNewline = /[\t\n\r]/g;
function stripTabAndNewline(value) {
  return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
  hostname.lastIndex = 0;
  return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
  protocol.lastIndex = 0;
  return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      const url = validateURL(trimmed, def);
      if (url === URL_BAD_FORMAT) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid URL format",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url === URL_UNPARSEABLE) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url === true) {
        payload.value = stripTabAndNewline(trimmed);
        return;
      }
      if (def.hostname && !urlHostnameOk(url, def.hostname)) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid hostname",
          pattern: def.hostname.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
      if (def.protocol && !urlProtocolOk(url, def.protocol)) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid protocol",
          pattern: def.protocol.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
      payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  if (def.length !== undefined && (!Number.isInteger(def.length) || def.length < 1))
    throw new Error(`Invalid nanoid length: ${def.length}`);
  def.pattern ?? (def.pattern = def.length === undefined ? nanoid : nanoidOfLength(def.length));
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
});
var ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
  if (!ipv6Alphabet.test(value))
    return false;
  return canParseURL(`http://[${value}]`);
}
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (!isValidIPv6(payload.value)) {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
function isValidCIDRv6(value) {
  const parts = value.split("/");
  if (parts.length !== 2)
    return false;
  const [address, prefix] = parts;
  if (!prefix)
    return false;
  const prefixNum = Number(prefix);
  if (`${prefixNum}` !== prefix)
    return false;
  if (prefixNum < 0 || prefixNum > 128)
    return false;
  return isValidIPv6(address);
}
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (!isValidCIDRv6(payload.value)) {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
var base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64Charset);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL(data) {
  if (!base64urlCharset.test(data))
    return false;
  const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64urlCharset);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : undefined : undefined;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {}
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  const memo = globalConfig.memoizer;
  memo?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
    const proms = [];
    const abortEarly = ctx?.abortEarly;
    for (let i = 0;i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result) => handleArrayResult(result, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
        if (abortEarly && result.issues.length !== 0 && aborted(result))
          break;
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, optin, optout) {
  const isPresent = key in input;
  const isOptionalOut = optout === "optional";
  if (!isPresent && isOptionalOut && optin === "optional") {
    return;
  }
  if (result.issues.length) {
    if (optin !== undefined && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && optin === undefined) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: undefined,
        path: [key]
      });
    }
    return;
  }
  if (result.value === undefined) {
    if (isPresent || optin === "defaulted" && !isOptionalOut) {
      final.value[key] = undefined;
    }
  } else {
    final.value[key] = result.value;
  }
}
var NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  const ownSymbols = Object.getOwnPropertySymbols(def.shape);
  const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
  const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
  for (const k of allKeys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    allKeys,
    symbolKeys,
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  const optin = _catchall.optin;
  const optout = _catchall.optout;
  let seen = 0;
  for (const key in input) {
    if (abortEarly && payload.issues.length !== seen) {
      if (aborted(payload, seen))
        break;
      seen = payload.issues.length;
    }
    if (keySet.has(key))
      continue;
    if (key === "__proto__") {
      if (t === "never")
        unrecognized.push(key);
      continue;
    }
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
    } else {
      handlePropertyResult(r, payload, key, input, optin, optout);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst,
      continue: true
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  const sh = desc?.get ? desc.get.raw : def.shape ?? {};
  if (sh) {
    const get = () => {
      const newSh = { ...sh };
      Object.defineProperty(def, "shape", { value: newSh });
      get.raw = newSh;
      return newSh;
    };
    get.raw = sh;
    Object.defineProperty(def, "shape", { get });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazyInternal(inst, "propValues", (zod) => {
    const shape = zod.def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        if (!Object.prototype.hasOwnProperty.call(propValues, key)) {
          assignProp(propValues, key, new Set);
        }
        for (const v of field.values)
          propValues[key].add(v);
        if (field.optin !== undefined)
          propValues[key].add(undefined);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def.catchall;
  let value;
  const memo = globalConfig.memoizer;
  memo?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
    const proms = [];
    const shape = value.shape;
    const abortEarly = ctx?.abortEarly;
    let seen = payload.issues.length;
    for (const key of value.allKeys) {
      if (abortEarly && payload.issues.length !== seen) {
        if (aborted(payload, seen))
          break;
        seen = payload.issues.length;
      }
      if (key === "__proto__")
        continue;
      const el = shape[key];
      const optin = el._zod.optin;
      const optout = el._zod.optout;
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
      } else {
        handlePropertyResult(r, payload, key, input, optin, optout);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const memo = globalConfig.memoizer;
  const generateFastpass = (shape) => {
    const normalized = _normalized.value;
    const syms = normalized.symbolKeys;
    const doc = new Doc(["payload", "ctx"], { shape, inst, memo, syms });
    const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    const prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
    doc.write(`const input = payload.value;`);
    const ids = Object.create(null);
    let counter = 0;
    for (const key of normalized.allKeys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
    for (const key of normalized.allKeys) {
      if (key === "__proto__")
        continue;
      const id = ids[key];
      const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
      const isPresent = `${k} in input`;
      const schema = shape[key];
      const optin = schema?._zod?.optin;
      const isOptionalIn = optin !== undefined;
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(k)};`);
      if (isOptionalIn && isOptionalOut) {
        const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
        doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `);
        if (optin === "defaulted") {
          doc.write(`newResult[${k}] = ${id}.value;`);
        } else {
          doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
        }
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    return doc.compile();
  };
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== undefined) ? "optional" : undefined);
  defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
  defineLazyInternal(inst, "values", (zod) => {
    if (zod.def.options.every((o) => o._zod.values)) {
      return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return;
  });
  defineLazyInternal(inst, "pattern", (zod) => {
    if (zod.def.options.every((o) => o._zod.pattern)) {
      const patterns = zod.def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results) => {
      return handleUnionResults(results, payload, inst, ctx);
    });
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left, right]) => {
        return handleIntersectionResults(payload, left, right);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    if (Object.prototype.hasOwnProperty.call(newObj, "__proto__"))
      delete newObj.__proto__;
    for (const key of sharedKeys) {
      if (key === "__proto__")
        continue;
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = new Map;
  let unrecIssue;
  const keyIssues = new Map;
  const collect = (iss, side) => {
    let keys;
    if (iss.code === "unrecognized_keys" && !iss.path?.length) {
      unrecIssue ?? (unrecIssue = iss);
      keys = iss.keys;
    } else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
      const k = String(iss.path[0]);
      if (!keyIssues.has(k))
        keyIssues.set(k, iss);
      keys = [k];
    } else {
      return false;
    }
    for (const k of keys) {
      if (!unrecKeys.has(k))
        unrecKeys.set(k, {});
      unrecKeys.get(k)[side] = true;
    }
    return true;
  };
  for (const iss of left.issues) {
    if (!collect(iss, "l"))
      result.issues.push(iss);
  }
  for (const iss of right.issues) {
    if (!collect(iss, "r"))
      result.issues.push(iss);
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length) {
    const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
    if (aggregated.length)
      result.issues.push({ ...unrecIssue, keys: aggregated });
    for (const k of bothKeys) {
      if (!aggregated.includes(k) && keyIssues.has(k))
        result.issues.push(keyIssues.get(k));
    }
  }
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    if (aborted(result))
      return result;
    throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  const memo = globalConfig.memoizer;
  memo?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values && !def.partial) {
      payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
      const recordKeys = new Set;
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          if (key === "__proto__")
            continue;
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          if (outKey === "__proto__")
            continue;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result) => {
              if (result.issues.length) {
                payload.issues.push(...prefixIssues(key, result.issues));
              }
              payload.value[outKey] = result.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          if (def.mode === "loose") {
            if (key === "__proto__")
              continue;
            payload.value[key] = input[key];
          } else {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          }
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: true
        });
      }
    } else {
      payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
      let unrecognized;
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else if (values) {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const outKey = keyResult.value;
        if (outKey === "__proto__")
          continue;
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result) => {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[outKey] = result.value;
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: true
        });
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  defineLazyInternal(inst, "pattern", (zod) => {
    const patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
    return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
  });
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  const values = new Set(def.values);
  inst._zod.values = values;
  defineLazyInternal(inst, "pattern", (zod) => {
    const vals = zod.def.values;
    return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
  });
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  globalConfig.memoizer?.guard(inst);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output) => {
        payload.value = output;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError;
    }
    payload.value = _out;
    return payload;
  };
});
function handleOptionalResult(payload, result) {
  payload.value = result.issues.length ? undefined : result.value;
  return payload;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
  inst._zod.optout = "optional";
  defineLazyInternal(inst, "values", (zod) => {
    const values = zod.def.innerType._zod.values;
    return values ? new Set([...values, undefined]) : undefined;
  });
  defineLazyInternal(inst, "pattern", (zod) => {
    const pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === undefined) {
      if (def.innerType._zod.optin !== "defaulted")
        return payload;
      const result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
      if (result instanceof Promise)
        return result.then((result) => handleOptionalResult(payload, result));
      return handleOptionalResult(payload, result);
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
  defineLazyInternal(inst, "pattern", (zod) => {
    const pattern = zod.def.innerType._zod.pattern;
    return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
  });
  defineLazyInternal(inst, "values", (zod) => {
    return zod.def.innerType._zod.values ? new Set([...zod.def.innerType._zod.values, null]) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "defaulted";
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleDefaultResult(result, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === undefined) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "defaulted";
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === undefined) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => {
    const v = zod.def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleNonOptionalResult(result, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === undefined) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
function handleCatchResult(payload, result, def, ctx) {
  if (!result.issues.length) {
    payload.value = result.value;
    if (result.memo)
      payload.memo = true;
    return payload;
  }
  payload.value = def.catchValue({
    ...result,
    value: payload.value,
    error: {
      issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
    },
    input: payload.value
  });
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
    if (result instanceof Promise) {
      return result.then((result) => handleCatchResult(payload, result, def, ctx));
    }
    return handleCatchResult(payload, result, def, ctx);
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
  defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
  defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right) => handlePipeResult(right, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left) => handlePipeResult(left, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  if (!payload.memo)
    payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r) => handleRefineResult(r, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      path: [...inst._zod.def.path ?? []],
      continue: !inst._zod.def.abort
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
// node_modules/zod/v4/core/memoizer.js
class $ZodCyclicError extends Error {
  constructor() {
    super(`Cannot parse a reference cycle that closes through a transform`);
    this.name = "ZodCyclicError";
  }
}
var STATE = "~memo";
var NO_ISSUES = [];
function isRef(value) {
  return value !== null && typeof value === "object";
}
function cloneIssues(issues) {
  return issues.map((iss) => iss.path ? { ...iss, path: iss.path.slice() } : { ...iss });
}
var recursive = /* @__PURE__ */ new WeakMap;
var NONE = 0;
var ASSUMED = 1;
var PROVEN = 2;
function isRecursive(inst, stack, resolve) {
  const cached = recursive.get(inst);
  if (cached !== undefined)
    return cached ? PROVEN : NONE;
  if (stack.has(inst))
    return PROVEN;
  stack.add(inst);
  let result = NONE;
  const check = (child) => {
    if (result !== PROVEN && child?._zod) {
      const answer = isRecursive(child, stack, resolve);
      if (answer > result)
        result = answer;
    }
  };
  const shape = (sh, spread) => {
    let answer = NONE;
    for (const key of Reflect.ownKeys(sh)) {
      const desc = Object.getOwnPropertyDescriptor(sh, key);
      if (spread && !desc.enumerable)
        continue;
      const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
      if (child > answer)
        answer = child;
    }
    return answer;
  };
  const merge = (answer) => {
    if (answer > result)
      result = answer;
  };
  const def = inst._zod.def;
  const kind = def.type;
  switch (kind) {
    case "object": {
      const raw = rawShape(def);
      merge(raw ? shape(raw, true) : ASSUMED);
      check(def.catchall);
      break;
    }
    case "array":
      check(def.element);
      break;
    case "tuple":
      for (const el of def.items)
        check(el);
      check(def.rest);
      break;
    case "record":
    case "map":
      check(def.keyType);
      check(def.valueType);
      break;
    case "set":
      check(def.valueType);
      break;
    case "union":
      for (const el of def.options)
        check(el);
      break;
    case "intersection":
      check(def.left);
      check(def.right);
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      check(def.innerType);
      break;
    case "pipe":
      check(def.in);
      check(def.out);
      break;
    case "function":
      check(def.input);
      check(def.output);
      break;
    case "lazy": {
      const inner = def._cachedInner ?? (resolve ? inst._zod.innerType : undefined);
      merge(inner ? isRecursive(inner, stack, false) : ASSUMED);
      break;
    }
    case "template_literal":
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default: {
      for (const key in def) {
        const desc = Object.getOwnPropertyDescriptor(def, key);
        if (!desc || desc.get)
          continue;
        const value = desc.value;
        if (!value || typeof value !== "object")
          continue;
        if (value._zod)
          check(value);
        else if (Array.isArray(value))
          for (const el of value)
            check(el);
      }
    }
  }
  stack.delete(inst);
  return settle(inst, result);
}
function settle(inst, answer) {
  if (answer !== ASSUMED)
    recursive.set(inst, answer === PROVEN);
  return answer;
}
function bucketFor(state, inst) {
  let bucket = state.buckets.get(inst);
  if (!bucket) {
    bucket = new WeakMap;
    state.buckets.set(inst, bucket);
  }
  return bucket;
}
var handoff;
var open = [];
var memo = {
  alloc(_inst, payload, empty) {
    const bucket = handoff;
    if (!bucket)
      return empty;
    handoff = undefined;
    const entry = { value: empty, issues: null };
    bucket.set(payload.value, entry);
    open.push(entry);
    return empty;
  },
  guard(inst) {
    var _a;
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred.push(() => {
      const base = inst._zod.parse;
      const wrapped = (payload, ctx) => {
        if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value))
          throw new $ZodCyclicError;
        return base(payload, ctx);
      };
      inst._zod.parse = wrapped;
      if (inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  },
  attach(inst) {
    var _a;
    let isRecursiveInst;
    let rechecked = false;
    let lastCtx;
    let lastBucket;
    (_a = inst._zod).deferred ?? (_a.deferred = []);
    inst._zod.deferred.push(() => {
      const base = inst._zod.parse;
      const wrapped = (payload, ctx) => {
        if (isRecursiveInst === undefined) {
          const walked = isRecursive(inst, new Set, false);
          if (walked === NONE) {
            inst._zod.parse = base;
            if (inst._zod.run === wrapped)
              inst._zod.run = base;
            return base(payload, ctx);
          }
          if (walked === PROVEN || rechecked)
            isRecursiveInst = true;
          else
            rechecked = true;
        }
        const input = payload.value;
        if (!isRef(input))
          return base(payload, ctx);
        let state = ctx[STATE];
        if (!state) {
          state = { buckets: new WeakMap, backEdges: undefined };
          ctx[STATE] = state;
        }
        let bucket;
        if (lastCtx === ctx) {
          bucket = lastBucket;
        } else {
          bucket = bucketFor(state, inst);
          lastCtx = ctx;
          lastBucket = bucket;
        }
        const hit = bucket.get(input);
        if (hit) {
          payload.value = hit.value;
          if (hit.issues) {
            if (hit.issues.length)
              payload.issues.push(...cloneIssues(hit.issues));
          } else {
            payload.memo = true;
            state.backEdges ?? (state.backEdges = new WeakSet);
            state.backEdges.add(hit.value);
          }
          return payload;
        }
        handoff = bucket;
        const depth = open.length;
        const result = base(payload, ctx);
        handoff = undefined;
        const entry = open.length > depth ? open.pop() : undefined;
        if (result instanceof Promise) {
          return result.then((r) => {
            if (entry)
              entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
            return r;
          });
        }
        if (entry)
          entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
        return result;
      };
      inst._zod.parse = wrapped;
      if (inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  }
};
function memoizer() {
  return memo;
}
function isBackEdge(ctx, value) {
  const backEdges = ctx[STATE]?.backEdges;
  return backEdges !== undefined && isRef(value) && backEdges.has(value);
}
// node_modules/zod/v4/locales/en.js
var error = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    currency_code: "currency code",
    credit_card: "credit card number",
    iban: "IBAN",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  function getTypeName(type, input) {
    if (type === "number" && typeof input === "number" && !Number.isFinite(input)) {
      return String(input);
    }
    return TypeDictionary[type] ?? type;
  }
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = getTypeName(issue.expected);
        const receivedType = parsedType(issue.input);
        const received = getTypeName(receivedType, issue.input);
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
      case "too_big": {
        const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue.origin}`;
      case "invalid_union":
        if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) {
          const opts = issue.options.map((o) => `'${o}'`).join(" | ");
          return `Invalid discriminator value. Expected ${opts}`;
        }
        if (issue.inclusive === false) {
          return "Invalid input: more than one option matched";
        }
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue.origin}`;
      default:
        return `Invalid input`;
    }
  };
};
function en_default() {
  return {
    localeError: error()
  };
}
// node_modules/zod/v4/core/registries.js
var _a2;
class $ZodRegistry {
  constructor() {
    this._map = new WeakMap;
    this._idmap = new Map;
  }
  add(schema, ..._meta) {
    const meta = _meta[0];
    this._map.set(schema, meta);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.set(meta.id, schema);
    }
    return this;
  }
  clear() {
    this._map = new WeakMap;
    this._idmap = new Map;
    return this;
  }
  remove(schema) {
    const meta = this._map.get(schema);
    if (meta && typeof meta === "object" && "id" in meta) {
      this._idmap.delete(meta.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : undefined;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
}
function registry() {
  return new $ZodRegistry;
}
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
// node_modules/zod/v4/core/api.js
function snapshotChecks(def) {
  if (def.checks)
    def.checks = [...def.checks];
  return def;
}
function _string(Class, params) {
  return new Class(snapshotChecks({ type: "string", ...normalizeParams(params) }));
}
function _email(Class, params) {
  return new Class({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _guid(Class, params) {
  return new Class({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuid(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _uuidv4(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
function _uuidv6(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
function _uuidv7(Class, params) {
  return new Class({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
function _url(Class, params) {
  return new Class({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _emoji2(Class, params) {
  return new Class({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _nanoid(Class, params) {
  return new Class({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid(Class, params) {
  return new Class({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cuid2(Class, params) {
  return new Class({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ulid(Class, params) {
  return new Class({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _xid(Class, params) {
  return new Class({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ksuid(Class, params) {
  return new Class({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv4(Class, params) {
  return new Class({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _ipv6(Class, params) {
  return new Class({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv4(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _cidrv6(Class, params) {
  return new Class({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64(Class, params) {
  return new Class({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _base64url(Class, params) {
  return new Class({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _e164(Class, params) {
  return new Class({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _jwt(Class, params) {
  return new Class({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
function _isoDateTime(Class, params) {
  return new Class({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDate(Class, params) {
  return new Class({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _isoTime(Class, params) {
  return new Class({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
function _isoDuration(Class, params) {
  return new Class({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
function _number(Class, params) {
  return new Class(snapshotChecks({ type: "number", checks: [], ...normalizeParams(params) }));
}
function _int(Class, params) {
  return new Class({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
function _boolean(Class, params) {
  return new Class({
    type: "boolean",
    ...normalizeParams(params)
  });
}
function _unknown(Class) {
  return new Class({
    type: "unknown"
  });
}
function _never(Class, params) {
  return new Class({
    type: "never",
    ...normalizeParams(params)
  });
}
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
function _regex(pattern, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern
  });
}
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
function _normalize(form) {
  return _overwrite((input) => input.normalize(form));
}
function _trim() {
  return _overwrite((input) => input.trim());
}
function _toLowerCase() {
  return _overwrite((input) => input.toLowerCase());
}
function _toUpperCase() {
  return _overwrite((input) => input.toUpperCase());
}
function _slugify() {
  return _overwrite((input) => slugify(input));
}
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    ...normalizeParams(params)
  });
}
function _refine(Class, fn, _params) {
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
function _superRefine(fn, params) {
  const ch = _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        if (!("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
// node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
  for (const source of sources) {
    for (const key of Reflect.ownKeys(source)) {
      if (Object.prototype.propertyIsEnumerable.call(source, key)) {
        assignProp(target, key, source[key]);
      }
    }
  }
  return target;
}
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {}),
    io: params?.io ?? "output",
    counter: 0,
    seen: new Map,
    sharedDefsExtractedFor: undefined,
    sharedEmitDoneFor: undefined,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    intersections: [],
    deferred: [],
    external: params?.external ?? undefined
  };
}
function handleUnrepresentable(schema, ctx, json, params, message) {
  const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({ zodSchema: schema, path: params.path, message }) : ctx.unrepresentable;
  if (result === "any")
    return false;
  if (result === undefined || result === "throw")
    throw new Error(message);
  Object.assign(json, result);
  return true;
}
function processSchema(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
  ctx.seen.set(schema, result);
  ctx.sharedDefsExtractedFor = undefined;
  ctx.sharedEmitDoneFor = undefined;
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      processSchema(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta = ctx.metadataRegistry.get(schema);
  if (meta)
    assignProps(result.schema, meta);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a = result.schema).default ?? (_a.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function encodeJSONPointerSegment(segment) {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external)
    return;
  const idToSchema = new Map;
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id) => id);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}` };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    if (entry[1] === root && !entry[1].schema.id) {
      return { ref: uriPrefix };
    }
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + encodeJSONPointerSegment(defId) };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema = seen.schema;
    for (const key in schema) {
      delete schema[key];
    }
    schema.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error("Cycle detected: " + `#/${seen.cycle?.join("/")}/<root>` + '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
      }
    }
  }
  if (ctx.external)
    ctx.sharedDefsExtractedFor = ctx.external;
}
function compactTypeUnion(schema) {
  const options = schema.anyOf;
  if (!Array.isArray(options) || options.length === 0 || schema.type !== undefined)
    return;
  const types = [];
  for (const option of options) {
    if (!option || typeof option !== "object")
      return;
    compactTypeUnion(option);
    const keys = Object.keys(option);
    if (keys.length !== 1 || keys[0] !== "type")
      return;
    const type = option.type;
    for (const member of Array.isArray(type) ? type : [type]) {
      if (typeof member !== "string")
        return;
      if (!types.includes(member))
        types.push(member);
    }
  }
  delete schema.anyOf;
  schema.type = types.length === 1 ? types[0] : types;
}
var FOLDABLE_KEYS = new Set(["type", "properties", "required", "additionalProperties"]);
var UNION_KEYS = ["oneOf", "anyOf"];
function undeclaredConstraint(member) {
  const extra = member.additionalProperties;
  if (extra === undefined || extra === false || typeof extra !== "object" || extra === null)
    return null;
  return Object.keys(extra).length ? extra : null;
}
function foldObjects(members) {
  const objects = [];
  for (const member of members) {
    if (typeof member !== "object" || member.type !== "object")
      return null;
    for (const key in member) {
      if (!FOLDABLE_KEYS.has(key))
        return null;
    }
    objects.push(member);
  }
  const properties = {};
  const required = new Set;
  for (const object of objects) {
    for (const key in object.properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key))
        continue;
      const parts = [];
      for (const other of objects) {
        const part = other.properties?.[key] ?? undeclaredConstraint(other);
        if (part === null || part === undefined)
          continue;
        if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part)))
          parts.push(part);
      }
      const merged = parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts };
      assignProp(properties, key, merged);
    }
    for (const key of object.required ?? [])
      required.add(key);
  }
  const folded = { type: "object", properties };
  if (required.size)
    folded.required = [...required];
  if (objects.every((object) => object.additionalProperties === false)) {
    folded.additionalProperties = false;
  } else {
    const constraints = [];
    for (const object of objects) {
      const constraint = undeclaredConstraint(object);
      if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint)))
        constraints.push(constraint);
    }
    if (constraints.length === 1)
      folded.additionalProperties = constraints[0];
    else if (constraints.length > 1)
      folded.additionalProperties = { allOf: constraints };
  }
  return folded;
}
function foldIntersection(json) {
  const allOf = json.allOf;
  if (!Array.isArray(allOf) || allOf.length < 2)
    return;
  for (const key of FOLDABLE_KEYS)
    if (key in json)
      return;
  const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
  let folded = null;
  if (!unions.length) {
    folded = foldObjects(allOf);
  } else {
    const union = unions[0];
    const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
    if (Object.keys(union).length !== 1)
      return;
    const rest = allOf.filter((m) => m !== union);
    const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
    if (branches.some((b) => !b))
      return;
    folded = { [keyword]: branches };
  }
  if (!folded)
    return;
  delete json.allOf;
  assignProps(json, folded);
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema = seen.def ?? seen.schema;
    const _cached = { ...schema };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema.allOf = schema.allOf ?? [];
        schema.allOf.push(refSchema);
      } else {
        assignProps(schema, refSchema);
      }
      assignProps(schema, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema,
      path: seen.path ?? []
    });
  };
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (const entry of [...ctx.seen.entries()].reverse()) {
      flattenRef(entry[0]);
    }
    if (ctx.target !== "openapi-3.0") {
      for (const entry of ctx.seen.entries()) {
        compactTypeUnion(entry[1].def ?? entry[1].schema);
      }
    }
    for (const rewrite of ctx.deferred)
      rewrite();
    if (ctx.intersections.length) {
      const carriers = new Map;
      for (const seen of ctx.seen.values()) {
        for (const json of [seen.schema, seen.def]) {
          const allOf = json?.allOf;
          if (!Array.isArray(allOf))
            continue;
          const existing = carriers.get(allOf);
          if (existing)
            existing.push(json);
          else
            carriers.set(allOf, [json]);
        }
      }
      for (const allOf of ctx.intersections) {
        for (const json of carriers.get(allOf) ?? [])
          foldIntersection(json);
      }
    }
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {}
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== undefined && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        if (seen.def.id === seen.defId)
          delete seen.def.id;
        assignProp(defs, seen.defId, seen.def);
      }
    }
  }
  if (ctx.external)
    ctx.sharedEmitDoneFor = ctx.external;
  if (ctx.external) {} else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: new Set };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  processSchema(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  processSchema(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
// node_modules/zod/v4/core/json-schema-processors.js
var narrowMin = (agg, key, value) => {
  if (agg[key] === undefined || value > agg[key])
    agg[key] = value;
};
var narrowMax = (agg, key, value) => {
  if (agg[key] === undefined || value < agg[key])
    agg[key] = value;
};
var narrowBoth = (agg, value) => {
  narrowMin(agg, "minimum", value);
  narrowMax(agg, "maximum", value);
};
var addDivisor = (agg, value) => {
  agg.multipleOf ?? (agg.multipleOf = []);
  if (!agg.multipleOf.includes(value))
    agg.multipleOf.push(value);
};
var addPattern = (agg, pattern) => {
  agg.patterns ?? (agg.patterns = new Set);
  agg.patterns.add(pattern);
};
var intersectMime = (agg, mime) => {
  agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
};
var setFormat = (agg, format) => {
  agg.format = format;
  if (format.includes("int"))
    agg.isInt = true;
};
var minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
var maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
var formatContributor = (ranges) => (agg, def) => {
  setFormat(agg, def.format);
  const [minimum, maximum] = ranges[def.format];
  narrowMin(agg, "minimum", minimum);
  narrowMax(agg, "maximum", maximum);
};
var contributors = {
  greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
  less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
  multiple_of: (agg, def) => addDivisor(agg, def.value),
  number_format: formatContributor(NUMBER_FORMAT_RANGES),
  bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
  min_length: minContributor,
  max_length: maxContributor,
  length_equals: (agg, def) => narrowBoth(agg, def.length),
  min_size: minContributor,
  max_size: maxContributor,
  size_equals: (agg, def) => narrowBoth(agg, def.size),
  string_format: (agg, def) => {
    setFormat(agg, def.format);
    if (def.pattern)
      addPattern(agg, def.pattern);
    if (def.format === "base64" || def.format === "base64url")
      agg.contentEncoding = def.format;
    if (def.local || def.precision === -1)
      agg.laxFormat = true;
  },
  mime_type: (agg, def) => intersectMime(agg, def.mime)
};
function aggregateChecks(schema) {
  const agg = {};
  const def = schema._zod.def;
  const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
  for (const ch of list)
    contributors[ch._zod.def.check]?.(agg, ch._zod.def);
  const bag = schema._zod.bag;
  if (bag.minimum !== undefined)
    narrowMin(agg, "minimum", bag.minimum);
  if (bag.exclusiveMinimum !== undefined)
    narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
  if (bag.maximum !== undefined)
    narrowMax(agg, "maximum", bag.maximum);
  if (bag.exclusiveMaximum !== undefined)
    narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
  if (bag.multipleOf !== undefined)
    addDivisor(agg, bag.multipleOf);
  if (bag.format !== undefined) {
    agg.format ?? (agg.format = bag.format);
    if (bag.format.includes("int"))
      agg.isInt = true;
  }
  if (bag.mime)
    intersectMime(agg, bag.mime);
  for (const pattern of bag.patterns ?? [])
    addPattern(agg, pattern);
  return agg;
}
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
};
var exactPatterns = new Map([
  [base64Charset, base64],
  [base64urlCharset, base64url]
]);
var exactPattern = (p) => exactPatterns.get(p) ?? p;
var stringProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  json.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    json.format = formatMap[format] ?? format;
    if (json.format === "")
      delete json.format;
    if (format === "time" || laxFormat) {
      delete json.format;
    }
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const patternList = [...patterns].map(exactPattern);
    if (patternList.length === 1)
      json.pattern = patternList[0].source;
    else if (patternList.length > 1) {
      json.allOf = [
        ...patternList.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
var numberProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
  json.type = isInt ? "integer" : "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json.minimum = exclusiveMinimum;
      json.exclusiveMinimum = true;
    } else {
      json.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json.maximum = exclusiveMaximum;
      json.exclusiveMaximum = true;
    } else {
      json.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json.maximum = maximum;
  }
  if (multipleOf) {
    const divisors = new Set;
    for (const divisor of multipleOf) {
      if (Number.isFinite(divisor) && divisor !== 0)
        divisors.add(Math.abs(divisor));
      else
        handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
    }
    const [first, ...rest] = divisors;
    if (first !== undefined)
      json.multipleOf = first;
    if (rest.length)
      json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
  }
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor = (_schema, _ctx, _json, _params) => {};
var enumProcessor = (schema, _ctx, json, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.length === 0) {
    json.not = {};
    return;
  }
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
};
var literalProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  if (def.values.length === 0) {
    json.not = {};
    return;
  }
  const vals = [];
  for (const val of def.values) {
    if (val === undefined) {
      if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema"))
        return;
    } else if (typeof val === "bigint") {
      if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema"))
        return;
      vals.push(Number(val));
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {} else if (vals.length === 1) {
    const val = vals[0];
    json.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.enum = [val];
    } else {
      json.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json.type = "boolean";
    if (vals.every((v) => v === null))
      json.type = "null";
    json.enum = vals;
  }
};
var customProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array";
  json.items = processSchema(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
function inputOptin(schema) {
  const def = schema._zod.def;
  if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) {
    return inputOptin(def.out);
  }
  if (def.type === "catch") {
    return inputOptin(def.innerType);
  }
  return schema._zod.optin;
}
var objectProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const shape = def.shape;
  const symbolKeys = Object.getOwnPropertySymbols(shape);
  if (symbolKeys.length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) {
    return;
  }
  json.type = "object";
  json.properties = {};
  for (const key in shape) {
    assignProp(json.properties, key, processSchema(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    }));
  }
  const requiredKeys = [];
  for (const key of Object.keys(shape)) {
    const field = def.shape[key];
    if (ctx.io === "input" ? inputOptin(field) === undefined : field._zod.optout === undefined) {
      requiredKeys.push(key);
    }
  }
  if (requiredKeys.length > 0) {
    json.required = requiredKeys;
  }
  if (def.catchall?._zod.def.type === "never") {
    json.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = false;
  } else if (def.catchall) {
    json.additionalProperties = processSchema(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
var unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => processSchema(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json.oneOf = options;
  } else {
    json.anyOf = options;
  }
};
var intersectionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const a = processSchema(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = processSchema(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => ("allOf" in val) && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf;
  ctx.intersections.push(allOf);
};
function stringifyKeyNames(bySchema, json, visited) {
  if (json.$ref) {
    if (visited.has(json))
      return json;
    visited.add(json);
    const def = bySchema.get(json)?.def;
    if (!def)
      return json;
    const inlined = stringifyKeyNames(bySchema, def, visited);
    return inlined === def ? json : inlined;
  }
  for (const keyword of ["anyOf", "oneOf"]) {
    const branches = json[keyword];
    if (!Array.isArray(branches))
      continue;
    const mapped = branches.map((branch) => stringifyKeyNames(bySchema, branch, visited));
    if (mapped.some((branch, i) => branch !== branches[i]))
      json = { ...json, [keyword]: mapped };
  }
  const types = Array.isArray(json.type) ? json.type : [json.type];
  const numericType = !types.includes("string") && types.some((t) => t === "number" || t === "integer");
  const values = json.enum ?? (json.const !== undefined ? [json.const] : undefined);
  if (!numericType && !values?.some((v) => typeof v === "number"))
    return json;
  const { minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf, format, id, ...rest } = json;
  if (rest.enum)
    rest.enum = rest.enum.map((v) => typeof v === "number" ? String(v) : v);
  else if (typeof rest.const === "number")
    rest.const = String(rest.const);
  if (!numericType)
    return rest;
  rest.type = "string";
  if (!values)
    rest.pattern = (types.includes("number") ? number : integer).source;
  return rest;
}
var pendingRecords = new WeakMap;
function rewriteKeyNames(ctx) {
  const bySchema = new Map;
  for (const entry of ctx.seen.values()) {
    if (entry.def && !bySchema.has(entry.schema))
      bySchema.set(entry.schema, entry);
  }
  const rewrites = new Map;
  for (const record of pendingRecords.get(ctx) ?? []) {
    const seen = ctx.seen.get(record);
    const names = (seen?.def ?? seen?.schema)?.propertyNames;
    if (!names || names === true || rewrites.has(names))
      continue;
    const rewritten = stringifyKeyNames(bySchema, names, new Set);
    if (rewritten !== names)
      rewrites.set(names, rewritten);
  }
  if (!rewrites.size)
    return;
  for (const entry of ctx.seen.values()) {
    for (const carrier of [entry.schema, entry.def]) {
      const rewritten = carrier && rewrites.get(carrier.propertyNames);
      if (rewritten)
        carrier.propertyNames = rewritten;
    }
  }
}
var recordProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  const keyType = def.keyType;
  const patterns = aggregateChecks(keyType).patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (const pattern of patterns) {
      assignProp(json.patternProperties, exactPattern(pattern).source, valueSchema);
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = processSchema(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
      let pending = pendingRecords.get(ctx);
      if (!pending) {
        pending = [];
        pendingRecords.set(ctx, pending);
        ctx.deferred.push(() => rewriteKeyNames(ctx));
      }
      pending.push(schema);
    }
    json.additionalProperties = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  const omittableOnInput = ctx.io === "input" && inputOptin(def.valueType) !== undefined;
  if (keyValues && !def.partial && !omittableOnInput) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json.required = validKeyValues.map(String);
    }
  }
};
var nullableProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const inner = processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json.nullable = true;
  } else {
    json.anyOf = [inner, { type: "null" }];
  }
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var UNREPRESENTABLE_DEFAULT = Symbol();
function serializeDefaultValue(value, schema, ctx, json, params) {
  let unrepresentable = false;
  const serialized = JSON.stringify(value, (_, val) => {
    if (typeof val !== "bigint")
      return val;
    unrepresentable = true;
    return null;
  });
  if (!unrepresentable)
    return JSON.parse(serialized);
  handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
  return UNREPRESENTABLE_DEFAULT;
}
var defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json.default = value;
};
var prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io !== "input")
    return;
  const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json._prefault = value;
};
var catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(undefined);
  } catch {
    handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
    return;
  }
  json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  processSchema(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
// node_modules/zod/v4/classic/errors.js
var _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
  Object.defineProperty(proto, key, {
    configurable: true,
    enumerable: false,
    get() {
      const value = make(this);
      Object.defineProperty(this, key, { value, configurable: true, writable: true });
      return value;
    },
    set(value) {
      Object.defineProperty(this, key, { value, configurable: true, writable: true });
    }
  });
}
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  const proto = Object.getPrototypeOf(inst);
  if (_installedErrorProtos.has(proto))
    return;
  _installedErrorProtos.add(proto);
  _lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
  _lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
  _lazyMethod(proto, "addIssue", (self) => (issue) => {
    self.issues.push(issue);
    self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  });
  _lazyMethod(proto, "addIssues", (self) => (issues) => {
    self.issues.push(...issues);
    self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  });
  Object.defineProperty(proto, "isEmpty", {
    configurable: true,
    enumerable: false,
    get() {
      return this.issues.length === 0;
    }
  });
};
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, undefined, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse2 = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
  if (!globalConfig.localeError)
    config(en_default());
}
function _ensureDefaultMemoizer() {
  if (!globalConfig.memoizer)
    config({ memoizer: memoizer() });
}
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  _ensureDefaultLocale();
  $ZodType.init(inst, def);
  inst.def = def;
  inst.type = def.type;
  return inst;
}, {
  check(...chks) {
    const def = this.def;
    return this.clone(mergeDefs(def, {
      checks: [
        ...def.checks ?? [],
        ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
      ]
    }), { parent: true });
  },
  with(...chks) {
    return this.check(...chks);
  },
  clone(def, params) {
    return clone(this, def, params);
  },
  brand() {
    return this;
  },
  register(reg, meta) {
    reg.add(this, meta);
    return this;
  },
  refine(check, params) {
    return this.check(refine(check, params));
  },
  superRefine(refinement, params) {
    return this.check(superRefine(refinement, params));
  },
  overwrite(fn) {
    return this.check(_overwrite(fn));
  },
  optional() {
    return optional(this);
  },
  exactOptional() {
    return exactOptional(this);
  },
  nullable() {
    return nullable(this);
  },
  nullish() {
    return optional(nullable(this));
  },
  nonoptional(params) {
    return nonoptional(this, params);
  },
  array() {
    return array(this);
  },
  or(arg) {
    return union([this, arg]);
  },
  and(arg) {
    return intersection(this, arg);
  },
  transform(tx) {
    return pipe(this, transform(tx));
  },
  default(d) {
    return _default(this, d);
  },
  prefault(d) {
    return prefault(this, d);
  },
  catch(params) {
    return _catch(this, params);
  },
  pipe(target) {
    return pipe(this, target);
  },
  readonly() {
    return readonly(this);
  },
  describe(description) {
    const cl = this.clone();
    globalRegistry.add(cl, { description });
    return cl;
  },
  meta(...args) {
    if (args.length === 0)
      return globalRegistry.get(this);
    const cl = this.clone();
    globalRegistry.add(cl, args[0]);
    return cl;
  },
  isOptional() {
    return this.safeParse(undefined).success;
  },
  isNullable() {
    return this.safeParse(null).success;
  },
  apply(fn, ...args) {
    return args.length === 0 ? fn(this) : fn(this, ...args);
  },
  get "~standard"() {
    return hide(this, "~standard", {
      ...standardProps(this),
      jsonSchema: {
        input: createStandardJSONSchemaMethod(this, "input"),
        output: createStandardJSONSchemaMethod(this, "output")
      }
    });
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  },
  parse: function _parse(data, params) {
    return parse2(this, data, params, { callee: _parse });
  },
  parseAsync: async function _parseAsync(data, params) {
    return await parseAsync(this, data, params, { callee: _parseAsync });
  },
  safeParse(data, params) {
    return safeParse(this, data, params);
  },
  async safeParseAsync(data, params) {
    return safeParseAsync(this, data, params);
  },
  get spa() {
    return this?.safeParseAsync;
  },
  set spa(value) {
    own(this, "spa", value);
  },
  validate(data, params) {
    return validate(this, data, params);
  },
  validateAsync(data, params) {
    return validateAsync(this, data, params);
  },
  encode: function _encode(data, params) {
    return encode(this, data, params, { callee: _encode });
  },
  decode: function _decode(data, params) {
    return decode(this, data, params, { callee: _decode });
  },
  encodeAsync: async function _encodeAsync(data, params) {
    return await encodeAsync(this, data, params, { callee: _encodeAsync });
  },
  decodeAsync: async function _decodeAsync(data, params) {
    return await decodeAsync(this, data, params, { callee: _decodeAsync });
  },
  safeEncode(data, params) {
    return safeEncode(this, data, params);
  },
  safeDecode(data, params) {
    return safeDecode(this, data, params);
  },
  async safeEncodeAsync(data, params) {
    return safeEncodeAsync(this, data, params);
  },
  async safeDecodeAsync(data, params) {
    return safeDecodeAsync(this, data, params);
  },
  toJSONSchema(params) {
    return createToJSONSchemaMethod(this, {})(params);
  },
  get description() {
    return globalRegistry.get(this)?.description;
  },
  get _def() {
    return this._zod.def;
  }
});
var _ZodString = /* @__PURE__ */ $constructor("_ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
}, /* @__PURE__ */ derived({
  format: (inst) => aggregateChecks(inst).format ?? null,
  minLength: (inst) => aggregateChecks(inst).minimum ?? null,
  maxLength: (inst) => aggregateChecks(inst).maximum ?? null
}, {
  regex(...args) {
    return this.check(_regex(...args));
  },
  includes(...args) {
    return this.check(_includes(...args));
  },
  startsWith(...args) {
    return this.check(_startsWith(...args));
  },
  endsWith(...args) {
    return this.check(_endsWith(...args));
  },
  min(...args) {
    return this.check(_minLength(...args));
  },
  max(...args) {
    return this.check(_maxLength(...args));
  },
  length(...args) {
    return this.check(_length(...args));
  },
  nonempty(...args) {
    return this.check(_minLength(1, ...args));
  },
  lowercase(params) {
    return this.check(_lowercase(params));
  },
  uppercase(params) {
    return this.check(_uppercase(params));
  },
  trim() {
    return this.check(_trim());
  },
  normalize(...args) {
    return this.check(_normalize(...args));
  },
  toLowerCase() {
    return this.check(_toLowerCase());
  },
  toUpperCase() {
    return this.check(_toUpperCase());
  },
  slugify() {
    return this.check(_slugify());
  }
}));
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
}, {
  email(params) {
    return this.check(_email(ZodEmail, params));
  },
  url(params) {
    return this.check(_url(ZodURL, params));
  },
  jwt(params) {
    return this.check(_jwt(ZodJWT, params));
  },
  emoji(params) {
    return this.check(_emoji2(ZodEmoji, params));
  },
  guid(params) {
    return this.check(_guid(ZodGUID, params));
  },
  uuid(params) {
    return this.check(_uuid(ZodUUID, params));
  },
  uuidv4(params) {
    return this.check(_uuidv4(ZodUUID, params));
  },
  uuidv6(params) {
    return this.check(_uuidv6(ZodUUID, params));
  },
  uuidv7(params) {
    return this.check(_uuidv7(ZodUUID, params));
  },
  nanoid(params) {
    return this.check(_nanoid(ZodNanoID, params));
  },
  cuid(params) {
    return this.check(_cuid(ZodCUID, params));
  },
  cuid2(params) {
    return this.check(_cuid2(ZodCUID2, params));
  },
  ulid(params) {
    return this.check(_ulid(ZodULID, params));
  },
  base64(params) {
    return this.check(_base64(ZodBase64, params));
  },
  base64url(params) {
    return this.check(_base64url(ZodBase64URL, params));
  },
  xid(params) {
    return this.check(_xid(ZodXID, params));
  },
  ksuid(params) {
    return this.check(_ksuid(ZodKSUID, params));
  },
  ipv4(params) {
    return this.check(_ipv4(ZodIPv4, params));
  },
  ipv6(params) {
    return this.check(_ipv6(ZodIPv6, params));
  },
  cidrv4(params) {
    return this.check(_cidrv4(ZodCIDRv4, params));
  },
  cidrv6(params) {
    return this.check(_cidrv6(ZodCIDRv6, params));
  },
  e164(params) {
    return this.check(_e164(ZodE164, params));
  },
  datetime(params) {
    return this.check(_isoDateTime(ZodISODateTime, params));
  },
  date(params) {
    return this.check(_isoDate(ZodISODate, params));
  },
  time(params) {
    return this.check(_isoTime(ZodISOTime, params));
  },
  duration(params) {
    return this.check(_isoDuration(ZodISODuration, params));
  }
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor("ZodNumber", (inst, def) => {
  $ZodNumber.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
  inst.isFinite = true;
}, /* @__PURE__ */ derived({
  minValue: (inst) => {
    const { minimum, exclusiveMinimum } = aggregateChecks(inst);
    return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
  },
  maxValue: (inst) => {
    const { maximum, exclusiveMaximum } = aggregateChecks(inst);
    return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
  },
  isInt: (inst) => {
    const { isInt, multipleOf } = aggregateChecks(inst);
    return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
  },
  format: (inst) => aggregateChecks(inst).format ?? null
}, {
  gt(value, params) {
    return this.check(_gt(value, params));
  },
  gte(value, params) {
    return this.check(_gte(value, params));
  },
  min(value, params) {
    return this.check(_gte(value, params));
  },
  lt(value, params) {
    return this.check(_lt(value, params));
  },
  lte(value, params) {
    return this.check(_lte(value, params));
  },
  max(value, params) {
    return this.check(_lte(value, params));
  },
  int(params) {
    return this.check(int(params));
  },
  safe(params) {
    return this.check(int(params));
  },
  positive(params) {
    return this.check(_gt(0, params));
  },
  nonnegative(params) {
    return this.check(_gte(0, params));
  },
  negative(params) {
    return this.check(_lt(0, params));
  },
  nonpositive(params) {
    return this.check(_lte(0, params));
  },
  multipleOf(value, params) {
    return this.check(_multipleOf(value, params));
  },
  step(value, params) {
    return this.check(_multipleOf(value, params));
  },
  finite() {
    return this;
  }
}));
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
  inst.element = def.element;
}, {
  min(n, params) {
    return this.check(_minLength(n, params));
  },
  nonempty(params) {
    return this.check(_minLength(1, params));
  },
  max(n, params) {
    return this.check(_maxLength(n, params));
  },
  length(n, params) {
    return this.check(_length(n, params));
  },
  unwrap() {
    return this.element;
  }
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
  installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
}, {
  keyof() {
    return _enum(Object.keys(this._zod.def.shape));
  },
  catchall(catchall) {
    return this.clone(mergeDefs(this._zod.def, { catchall }));
  },
  passthrough() {
    return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
  },
  loose() {
    return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
  },
  strict() {
    return this.clone(mergeDefs(this._zod.def, { catchall: never() }));
  },
  strip() {
    return this.clone(mergeDefs(this._zod.def, { catchall: undefined }));
  },
  extend(incoming) {
    return extend(this, incoming);
  },
  safeExtend(incoming) {
    return safeExtend(this, incoming);
  },
  merge(other) {
    return merge(this, other);
  },
  pick(mask) {
    return pick(this, mask);
  },
  omit(mask) {
    return omit(this, mask);
  },
  partial(...args) {
    return partial(ZodOptional, this, args[0]);
  },
  exactPartial(...args) {
    return partial(ZodExactOptional, this, args[0], "exactPartial");
  },
  required(...args) {
    return required(ZodNonOptional, this, args[0]);
  }
});
function object(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...normalizeParams(params)
  };
  return new ZodObject(def);
}
function strictObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: never(),
    ...normalizeParams(params)
  });
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...normalizeParams(params)
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
  inst.enum = def.entries;
  inst.options = [...inst._zod.values];
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        if (!("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output) => {
        payload.value = output;
        return payload;
      });
    }
    payload.value = output;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
  });
}
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
// src/core/deploy-window.ts
var WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];
function minutesOf(text) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(text);
  if (match)
    return Number(match[1]) * 60 + Number(match[2]);
  return text === "24:00" ? 1440 : undefined;
}
function windowProblem(window) {
  const from = minutesOf(window.from);
  const to = minutesOf(window.to);
  if (from === undefined || to === undefined)
    return;
  return to > from ? undefined : { kind: "window-ends-first", from: window.from, to: window.to };
}
var formats = new Map;
function isUtc(timeZone) {
  return timeZone === "UTC";
}
function format(timeZone) {
  let found = formats.get(timeZone);
  if (found === undefined) {
    found = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    formats.set(timeZone, found);
  }
  return found;
}
function wall(at, timeZone) {
  if (isUtc(timeZone)) {
    return {
      year: at.getUTCFullYear(),
      month: at.getUTCMonth() + 1,
      day: at.getUTCDate(),
      minutes: at.getUTCHours() * 60 + at.getUTCMinutes()
    };
  }
  const parts = {};
  for (const part of format(timeZone).formatToParts(at)) {
    if (part.type !== "literal")
      parts[part.type] = Number(part.value);
  }
  const { year = 0, month = 1, day = 1, hour = 0, minute = 0 } = parts;
  return { year, month, day, minutes: hour * 60 + minute };
}
function offsetAt(at, timeZone) {
  if (isUtc(timeZone))
    return 0;
  const clock = wall(at, timeZone);
  const shown = Date.UTC(clock.year, clock.month - 1, clock.day, 0, clock.minutes);
  const truncated = Math.floor(at.getTime() / 60000) * 60000;
  return Math.round((shown - truncated) / 60000);
}
function instantOf(day, minutes, timeZone) {
  const guess = Date.UTC(day.year, day.month - 1, day.day, 0, minutes);
  if (isUtc(timeZone))
    return guess;
  const first = guess - offsetAt(new Date(guess), timeZone) * 60000;
  const second = guess - offsetAt(new Date(first), timeZone) * 60000;
  return second;
}
var DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T([01]\d|2[0-3]):([0-5]\d)$/;
function wallOf(text) {
  const match = DATE_TIME.exec(text);
  if (!match)
    return;
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  const real = new Date(Date.UTC(year, month - 1, day));
  if (real.getUTCMonth() !== month - 1 || real.getUTCDate() !== day)
    return;
  return { day: { year, month, day }, minutes: hour * 60 + minute };
}
function freezeProblem(freeze) {
  for (const value of [freeze.from, freeze.to]) {
    if (DATE_TIME.test(value) && wallOf(value) === undefined) {
      return { kind: "not-a-date-time", value };
    }
  }
  return freeze.to > freeze.from ? undefined : { kind: "freeze-ends-first", from: freeze.from, to: freeze.to };
}
function spanOf(freeze, timeZone) {
  const from = wallOf(freeze.from);
  const to = wallOf(freeze.to);
  if (from === undefined || to === undefined)
    return;
  return {
    starts: instantOf(from.day, from.minutes, timeZone),
    ends: instantOf(to.day, to.minutes, timeZone)
  };
}
var WEEK = 7 * 24 * 60 * 60000;
function endedFreezes(freezes, now, timeZone) {
  return freezes.flatMap((freeze) => {
    const span = spanOf(freeze, timeZone);
    return span !== undefined && span.ends <= now.getTime() ? [{ freeze, ended: new Date(span.ends) }] : [];
  });
}

// src/render/config-problems.ts
function configErrorText(file, problems) {
  return [`${file} is not valid:`, ...problems.map((problem) => `- ${problem}`)].join(`
`);
}
function configProblemText(issue) {
  return `${where(issue.path)}${problemWords(issue)}`;
}
function problemWords(issue) {
  switch (issue.kind) {
    case "not-yaml":
      return `line ${issue.line}, column ${issue.column}: not valid YAML. ${issue.detail}`;
    case "two-config-files":
      return `found both ${issue.files.join(" and ")}. Keep one of them.`;
    case "not-a-file":
      return "it is not a file.";
    case "unknown-key":
      return `unknown key "${issue.key}". Known keys here: ${issue.known.join(", ")}.`;
    case "drift-schedule":
      return `"schedule" is not a key of sluiceway.yaml. A drift check runs in every scan that a schedule starts, so the cron goes in the workflow, under \`on: schedule\`.`;
    case "notify-unknown-key":
      return `unknown key "${issue.key}". Known keys here: ${issue.known.join(", ")}. A channel is an input of the step, from a secret, never a key of sluiceway.yaml.`;
    case "reserved-key":
      return `"${issue.key}" is not in this version of Sluiceway yet. Remove it.`;
    case "required-stack-path":
      return "is required. It is the directory of the stack, relative to the repo root.";
    case "required-ignore-reason":
      return `is required. Say why the stack is left out, or write the glob as text: ${show(issue.glob)}.`;
    case "required-ignore-glob":
      return "is required. It is matched against the stack id.";
    case "not-a-count":
      return issue.max === undefined ? `expected a whole number of ${issue.counts}, ${issue.min} or more, got ${show(issue.value)}.` : `expected a whole number of ${issue.counts} from ${issue.min} to ${issue.max}, got ${show(issue.value)}.`;
    case "not-an-ignore-entry":
      return `expected a glob as text, or a mapping with glob and reason, got ${show(issue.value)}.`;
    case "not-a-depends-on":
      return `expected a list of stack ids, or ${issue.auto}, got ${show(issue.value)}.`;
    case "not-a-phase":
      return `expected a phase name, or a mapping with from, got ${show(issue.value)}.`;
    case "stack-cost-not-a-mapping":
      return `expected a mapping, got ${show(issue.value)}. Write it as the top level has it: cost: { enabled: true }.`;
    case "cost-threshold-without-enabled":
      return "a threshold needs the estimate: set cost.enabled: true next to it, or on the stack's entry.";
    case "not-an-amount":
      return `expected an amount a month, 0 or more, got ${show(issue.value)}.`;
    case "stack-drift-not-a-mapping":
      return `expected a mapping, got ${show(issue.value)}. Write it as the top level has it: drift: { enabled: ${typeof issue.value === "boolean" ? issue.value : true} }.`;
    case "not-a-tick-rule":
      return `expected "write", "maintain", "admin" or a list of usernames, got ${show(issue.value)}.`;
    case "not-a-deploy-trigger":
      return `expected "on-tick" or "on-merge", got ${show(issue.value)}.`;
    case "not-one-of":
      return `expected one of ${issue.choices.map((choice) => `"${choice}"`).join(", ")}, got ${show(issue.value)}.`;
    case "section-named-twice":
      return `${show(issue.section)} is already dashboard.sections[${issue.first}]. Name each section once.`;
    case "not-an-event":
      return `${show(issue.value)} is not an event. The events are: ${issue.events.join(", ")}.`;
    case "not-a-phase-name":
      return `${show(issue.value)} is not a phase name. Use letters, digits, ".", "_" and "-".`;
    case "not-a-login":
      return `${show(issue.value)} is not a GitHub login. Write the login alone, without "@". An app is written with [bot], such as renovate[bot].`;
    case "not-a-time-zone":
      return `${show(issue.value)} is not a time zone. Write an IANA name, such as Europe/Brussels or America/New_York, or leave the key out for UTC.`;
    case "not-a-weekday":
      return `${show(issue.value)} is not a day of the week. Write one of: ${WEEKDAYS.join(", ")}.`;
    case "no-days":
      return "a window needs at least one day of the week.";
    case "not-a-clock-time":
      return `${show(issue.value)} is not a clock time. Write HH:MM on a 24 hour clock in quotes, such as "09:00" or "17:30". "24:00" is the end of the day.`;
    case "window-ends-first":
      return `the window ends at "${issue.to}", which is not after it starts at "${issue.from}". A window over midnight is two windows: one to "24:00" and one from "00:00" on the next day.`;
    case "not-a-date-time":
      return `${show(issue.value)} is not a date and a time. Write YYYY-MM-DDTHH:MM in the dashboard zone, such as "2026-12-20T00:00", with no zone and no seconds, on a day the calendar has.`;
    case "freeze-ends-first":
      return `the freeze ends at "${issue.to}", which is not after it starts at "${issue.from}".`;
    case "a-team":
      return `${show(issue.value)} looks like a team. Teams are not supported yet. Use a level ("write", "maintain", "admin") or usernames.`;
    case "not-a-username":
      return `${show(issue.value)} is not a GitHub username. Write the login alone, without "@".`;
    case "no-tickers":
      return "the list is empty, so nobody could tick. Name at least one username or use a level.";
    case "empty-stack-path":
      return 'must not be empty. Use "." for the repo root.';
    case "empty":
      return "must not be empty.";
    case "wrong-type":
      return `expected ${EXPECTED[issue.expected] ?? issue.expected}, got ${show(issue.value)}.`;
    case "backslash-in-path":
      return `${show(issue.value)} must use forward slashes.`;
    case "absolute-path":
      return `${show(issue.value)} must be relative to the repo root.`;
    case "path-leaves-repo":
      return `${show(issue.value)} must stay inside the repo, so ".." is not allowed.`;
    case "option-without-tool":
      return `unknown option ${show(issue.option)}. A stack that discovery finds from its files takes no options. Only an entry with tool takes them.`;
    case "same-entry":
      return `says the same path and name as stacks[${issue.first}] (${show(issue.stackId)}). Put the settings in one entry.`;
    case "phase-named-twice":
      return `${show(issue.phase)} is already phases[${issue.first}]. Each phase is named once.`;
    case "unknown-phase":
      return issue.phases.length === 0 ? `${show(issue.phase)} is not one of the phases, and sluiceway.yaml has no phases. List them in order at the top: phases: [first, second].` : `${show(issue.phase)} is not one of the phases. The phases are: ${issue.phases.join(", ")}.`;
    case "id-covers-no-stack":
      return `the entry covers no stack, so there is nothing to name ${issue.id}.`;
    case "id-covers-stacks":
      return `the entry covers ${issue.stackIds.length} stacks (${issue.stackIds.join(", ")}), and an id names one. Give the entry a name.`;
    case "id-given-twice":
      return `${issue.stackId} already has the id ${issue.id}.`;
    case "id-taken":
      return `${show(issue.id)} is the id of another stack already. Every stack id is unique.`;
    case "entry-only-ignored": {
      const ids = issue.stackIds.map(show).join(", ");
      const subject = issue.stackIds.length === 1 ? `the stack ${ids} is` : `the stacks ${ids} are`;
      return `${subject} left out by ignore, so these settings would do nothing. Remove the entry, or change ignore.`;
    }
    case "entry-no-stack":
      return `no stack was found in ${show(issue.stackPath)}. An entry adds settings to a stack that exists, it never creates one.`;
    case "entry-no-named-stack": {
      const found = issue.names.length === 0 ? "The stack found there has no name." : `Found there: ${issue.names.join(", ")}.`;
      return `no stack named ${show(issue.name)} was found in ${show(issue.stackPath)}. ${found}`;
    }
    case "no-phase-key":
      return `${issue.stackId} has no text under ${issue.key} in its project file, under config or at the top level. Add it there, or name the phase here.`;
    case "phase-key-unknown": {
      const known = issue.phases.join(", ");
      return `the text under ${issue.key} in the project file of ${issue.stackId} is not one of the phases. The phases are: ${known === "" ? "none, sluiceway.yaml has no phases" : known}.`;
    }
    case "depends-on-ignored": {
      const why = issue.reason === undefined ? "" : ` (${show(issue.reason)})`;
      return `${show(issue.stackId)} is left out by ignore${why}, so it never has a change to wait for. Remove it here, or change ignore.`;
    }
    case "depends-on-unknown":
      return `${show(issue.stackId)} is not a stack that discovery found. Write the stack id as a row shows it, such as ${show(issue.example ?? "network:dev")}.`;
    case "depends-on-itself":
      return `${show(issue.stackId)} is the stack itself. A stack cannot depend on itself.`;
    case "depends-on-earlier-phase":
      return `${show(issue.stackId)} is in the ${issue.phase} phase, which comes after the ${issue.stackPhase} phase of ${issue.stack}. ${issue.stackId} already waits on every stack of the ${issue.stackPhase} phase, so take this out, or move one of them to another phase.`;
    case "depends-on-circle":
      return `dependsOn goes round in a circle: ${circleText(issue.circle)}. Nothing in a circle could ever deploy first, so take one of these out.`;
    case "worded":
      return issue.text;
  }
}
function circleText(circle) {
  const [first, ...rest] = circle;
  const links = rest.map((to, index) => {
    const from = circle[index];
    if ("phase" in to)
      return `${index === 0 ? "" : "which "}waits on the ${to.phase} phase`;
    if (from !== undefined && "phase" in from)
      return `which holds ${to.stack}`;
    return `${index === 0 ? "depends on" : "which depends on"} ${to.stack}`;
  });
  return `${first === undefined ? "" : ("phase" in first) ? first.phase : first.stack} ${links.join(", ")}`;
}
var EXPECTED = {
  string: "text",
  boolean: "true or false",
  array: "a list",
  object: "a mapping"
};
function show(value) {
  if (value === null || value === undefined)
    return "nothing";
  if (Array.isArray(value))
    return "a list";
  if (typeof value === "object")
    return "a mapping";
  return JSON.stringify(value);
}
function where(path) {
  const text = path.map((segment) => typeof segment === "number" ? `[${segment}]` : `.${String(segment)}`).join("").replace(/^\./, "");
  return text === "" ? "" : `${text}: `;
}

// src/render/escape.ts
var NAMED = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
var SPLIT = new Set(["#", "@"]);
function escapeOne(match) {
  const named = NAMED[match];
  if (named !== undefined)
    return named;
  if (SPLIT.has(match))
    return `<span>${match}</span>`;
  if (match === "://")
    return "&#58;//";
  if (match.toLowerCase() === "www.")
    return `${match.slice(0, 3)}&#46;`;
  if (match.toLowerCase() === "gh-")
    return `${match.slice(0, 2)}<span>-</span>`;
  return `&#${match.charCodeAt(0)};`;
}
function escapeText(text) {
  return text.replace(/[\p{Cc}\p{Zl}\p{Zp}]/gu, " ").replace(/www\.|:\/\/|gh-(?=\d)|[&<>"*_`~[\]|\\#@]/gi, escapeOne);
}

// src/core/glob.ts
var import_picomatch = __toESM(require_picomatch2(), 1);
function globMatcher(globs) {
  if (globs.length === 0)
    return () => false;
  return import_picomatch.default(globs, { dot: true });
}
function globOf(text) {
  return text.replace(/[\\*?[\]{}()!+@|]/g, "\\$&");
}

// src/core/claim.ts
var DEFAULT_UNRELATED = [
  "**/*.md",
  "**/LICENSE*",
  "**/.gitignore",
  "**/.gitattributes",
  ".editorconfig",
  ".github/**"
];
var isDefaultUnrelated = globMatcher([...DEFAULT_UNRELATED]);
function inside(directory, file) {
  return directory === "." || file.startsWith(`${directory}/`);
}
function claim2(stacks, changed, unrelated) {
  const isUnrelated = globMatcher(unrelated);
  const matchers = stacks.map((stack) => ({ stack, matches: globMatcher(stack.inputs) }));
  const claims = new Map;
  const unclaimed = [];
  for (const file of new Set(changed)) {
    if (isUnrelated(file))
      continue;
    const claimants = matchers.filter(({ stack, matches }) => inside(stack.path, file) || matches(file));
    if (claimants.length === 0 && !isDefaultUnrelated(file))
      unclaimed.push(file);
    for (const { stack } of claimants)
      claims.set(stack.id, [...claims.get(stack.id) ?? [], file]);
  }
  return { claims, unclaimed };
}

// src/core/attribution.ts
var LOOKBACK = 100;
var NAMED_ON_A_ROW = 5;

// src/core/stack.ts
function stackId(stack) {
  if (stack.id !== undefined)
    return stack.id;
  return stack.name === undefined ? stack.path : `${stack.path}:${stack.name}`;
}

// src/core/discovery.ts
class DiscoveryError extends Error {
  problems;
  constructor(problems) {
    super([
      "Could not work out the stacks of this repo:",
      ...problems.map((problem) => `- ${problem}`)
    ].join(`
`));
    this.name = "DiscoveryError";
    this.problems = problems;
  }
}
function knownStacks(found, ignore) {
  const ignored = globMatcher(ignore);
  const known = found.filter((stack) => !ignored(stackId(stack)));
  const byId = Map.groupBy(known, stackId);
  const problems = [...byId].flatMap(([id, sharing]) => sharing.length < 2 ? [] : [
    `two stacks have the id ${JSON.stringify(id)}: ${sharing.map(describe2).join(", and ")}. A stack id has to name one stack. Rename or move one of them.`
  ]);
  if (problems.length > 0)
    throw new DiscoveryError(problems);
  return known;
}
function describe2(stack) {
  const path = JSON.stringify(stack.path);
  const where = stack.name === undefined ? `in ${path}` : `${JSON.stringify(stack.name)} in ${path}`;
  const { tool } = stack.options;
  return typeof tool === "string" ? `the stack ${where} that a stacks entry declares with tool: ${tool}` : `the Pulumi stack ${where}`;
}

// src/render/marker.ts
var utf8 = new TextDecoder;
var PAIRS = '((?: [^\\s="]+="[^"]*")*)';
var ROOT_LINE = new RegExp(`^<!-- sluiceway:dashboard${PAIRS} -->[ \\t]*$`);
var ROW_LINE = new RegExp(`^- (?:\\[([ xX])\\] )?.*<!-- sluiceway:row${PAIRS} -->[ \\t]*$`);
var MERGE_LINE = new RegExp(`^- (?:\\[([ xX])\\] )?.*<!-- sluiceway:merge${PAIRS} -->[ \\t]*$`);
var WAITING_LINE = new RegExp(`^- .*<!-- sluiceway:waiting${PAIRS} -->[ \\t]*$`);
var OUTSIDE_LINE = new RegExp(`^- .*<!-- sluiceway:outside${PAIRS} -->[ \\t]*$`);
var BULK_LINE = new RegExp(`^- \\[([ xX])\\] .*<!-- sluiceway:bulk${PAIRS} -->[ \\t]*$`);

// src/core/notify.ts
var NOTIFY_EVENTS = ["pending", "drift", "deployed", "failed", "refused"];
var DEFAULT_NOTIFY_EVENTS = [
  "pending",
  "drift",
  "failed",
  "refused"
];

// src/core/phases.ts
function phaseKeysOf(config) {
  return [
    ...new Set(config.stacks.flatMap((entry) => typeof entry.phase === "object" ? [entry.phase.from] : []))
  ];
}
var PHASE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
function phaseGroups(phases, phaseOf) {
  return phases.map((phase) => ({
    phase,
    stackIds: [...phaseOf].flatMap(([id, one]) => one === phase ? [id] : []).sort(byCodeUnit)
  }));
}
function phaseDependencies(phases, phaseOf) {
  const index = (id) => phases.indexOf(phaseOf.get(id) ?? "");
  const edges = new Map;
  for (const id of [...phaseOf.keys()].sort(byCodeUnit)) {
    const at = index(id);
    if (at === -1)
      continue;
    edges.set(id, [...phaseOf.keys()].filter((other) => index(other) !== -1 && index(other) < at).sort(byCodeUnit));
  }
  return edges;
}
function throughPhase(phases, phaseOf, stackId, dependency) {
  const own = phases.indexOf(phaseOf.get(stackId) ?? "");
  const theirs = phases.indexOf(phaseOf.get(dependency) ?? "");
  return own !== -1 && theirs !== -1 && theirs < own;
}
function waitsByPhase(input) {
  const { phases, phaseOf, stackId } = input;
  const named = [];
  const grouped = new Map;
  for (const id of [...new Set(input.waitingOn)].sort(byCodeUnit)) {
    const phase = phaseOf.get(id);
    if (phase === undefined || !throughPhase(phases, phaseOf, stackId, id))
      named.push(id);
    else
      grouped.set(phase, [...grouped.get(phase) ?? [], id]);
  }
  return {
    named,
    phases: phases.flatMap((phase) => {
      const stackIds = grouped.get(phase);
      return stackIds ? [{ phase, stackIds }] : [];
    })
  };
}

// src/core/show-values.ts
var patterns = new Map;
function showValuesEntryProblem(entry) {
  const quoted = JSON.stringify(entry);
  if (entry === "")
    return;
  if (entry.includes("**")) {
    return `${quoted} uses "**". An entry matches one path, and "*" stands for part of one name. Write each path whose value may appear.`;
  }
  if (!/[^*.[\]]/.test(entry)) {
    return `${quoted} names no property. Write each path whose value may appear.`;
  }
  return;
}

// src/core/config.ts
var DEPENDS_ON_AUTO = "auto";
var username = string2().regex(/^[A-Za-z0-9_-]+$/);
var tickers = union([
  _enum(["write", "maintain", "admin"]),
  array(username).min(1).transform((names) => [...new Set(names.map((name) => name.toLowerCase()))])
]);
var author = string2().regex(/^[A-Za-z0-9_-]+(\[bot\])?$/).transform((login) => login.toLowerCase());
var text = string2().min(1);
var globs = array(text);
var ignoreEntry = union([
  text,
  strictObject({
    glob: text.describe("Glob matched against the stack id."),
    reason: text.describe("Why these stacks are left out. Shown on the dashboard under In sync.")
  })
]);
var phaseName = text.regex(PHASE_NAME);
var STACK_ID = /^[A-Za-z0-9][A-Za-z0-9._/:@+-]*$/;
var stackPath = text.superRefine((path, context) => {
  if (path.includes("\\"))
    refuse(context, { kind: "backslash-in-path", value: path });
  else if (path.startsWith("/"))
    refuse(context, { kind: "absolute-path", value: path });
  else if (path.split("/").includes(".."))
    refuse(context, { kind: "path-leaves-repo", value: path });
}).transform((path) => {
  const segments = path.split("/").filter((segment) => segment !== "" && segment !== ".");
  return segments.length === 0 ? "." : segments.join("/");
});
var CLOCK_TIME = /^(?:([01]\d|2[0-3]):[0-5]\d|24:00)$/;
var clockTime = string2().regex(CLOCK_TIME);
var deployWindow = strictObject({
  days: array(_enum(WEEKDAYS)).min(1).describe("The days of the week the window is on, in full and in lower case: monday to sunday."),
  from: clockTime.describe("When the window opens on each of those days, as HH:MM on a 24 hour clock in the dashboard zone."),
  to: clockTime.describe("When it closes, as HH:MM, after from. 24:00 is the end of the day.")
}).superRefine((window, context) => {
  const problem = windowProblem(window);
  if (problem)
    refuse(context, problem);
});
var deployWindows = array(deployWindow);
var DATE_TIME2 = /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/;
var dateTime = string2().regex(DATE_TIME2);
var deployFreeze = strictObject({
  from: dateTime.describe("When the freeze starts, as YYYY-MM-DDTHH:MM in the dashboard zone, such as 2026-12-20T00:00."),
  to: dateTime.describe("When it ends, as YYYY-MM-DDTHH:MM, after from. The end is outside it."),
  reason: text.describe("Why nothing goes out, shown on the dashboard and on every row that waits for it.").optional()
}).superRefine((freeze, context) => {
  const problem = freezeProblem(freeze);
  if (problem)
    refuse(context, problem);
});
var policyPaths = array(stackPath).transform((paths) => [...new Set(paths)]);
var stackEntry = strictObject({
  path: stackPath.describe("Directory of the stack, relative to the repo root."),
  name: text.describe("Name of the stack. Without it the entry covers every stack in path.").exactOptional(),
  tool: text.describe("The tool of a stack that discovery cannot find from files alone. The entry then declares the stack at path. See the configuration reference for the tools.").exactOptional(),
  id: text.regex(STACK_ID, "must be letters, digits and . _ / : @ + -, starting with a letter or digit").describe("The id of the one stack this entry covers, in place of the one derived from its path and name. A stack that moved keeps its row and its deploys under it. Unique among every stack id.").exactOptional(),
  environment: text.describe("Label on the deployment record, and the GitHub Environment where one is used. Default: sluiceway.").exactOptional(),
  tickers: tickers.describe("Tick rule for this stack. Default: the top level tickers.").exactOptional(),
  inputs: globs.describe("Extra globs this stack claims, relative to the repo root.").exactOptional(),
  previewTimeout: int().min(1).describe("Time limit for one preview of this stack, in whole minutes. Default: the preview-timeout input.").exactOptional(),
  dependsOn: union([literal(DEPENDS_ON_AUTO), array(text)]).describe("Stack ids of the stacks this stack depends on, or auto to read them from the program's stack references at each preview. A tick on this stack is refused while one of them has a change waiting, and when both are ticked they deploy in order.").exactOptional(),
  phase: union([
    phaseName,
    strictObject({
      from: text.describe("A key of the project file whose text is the phase, under config or at the top level.")
    })
  ]).describe("The phase of these stacks, one of phases, or from: a key of the project file that names it. A stack in a phase depends on every stack in every earlier phase.").exactOptional(),
  deploy: _enum(["on-tick", "on-merge"]).describe("When these stacks deploy. on-tick: when a person ticks the row, the default. on-merge: by themselves after the scan of a merge that found them pending, through the same fresh preview and hash check as a tick, attributed to whoever merged. A change that deletes or replaces something, drift, and a stack it depends on that waits for a tick still wait for a tick.").exactOptional(),
  deployWindows: deployWindows.describe("When these stacks may go out, in place of the top level deployWindows. An empty list lets them go out at any time.").exactOptional(),
  drift: strictObject({
    enabled: boolean2().describe("Check these stacks for drift, or not, whatever drift.enabled at the top level says. The scans that check are the same.")
  }).describe("The drift check of these stacks. Default: the top level drift.").exactOptional(),
  valueFingerprint: boolean2().describe("Cover the values these stacks' rows do not show with a fingerprint, or not, whatever valueFingerprint at the top level says. Turn it off for a stack whose program makes a value that differs on every run. Default: the top level valueFingerprint.").exactOptional(),
  envFile: text.refine((path) => !/[\r\n]/.test(path), {
    message: "envFile names one file on one line. To load several files, join them in a step before Sluiceway."
  }).describe("A file of NAME=value lines, relative to the repo root or absolute, that the tool gets for these stacks alone, on top of the job environment and the step's env-file input. Every value is masked first. A file that cannot be loaded fails the preview of these stacks and no other.").exactOptional(),
  policies: policyPaths.describe("Directories or files of Rego policies these stacks are tested against, relative to the repo root, on top of the top level policies.").exactOptional(),
  createInBackend: boolean2().describe("true: a scan creates each Pulumi stack of the entry that the backend lacks, with pulumi stack init right before its first preview, and previews it as all creates. A deploy never creates a stack. Default: false.").exactOptional(),
  cost: strictObject({
    enabled: boolean2().describe("Estimate what a change of these stacks costs a month, or not, whatever cost.enabled at the top level says. Only an OpenTofu or Terraform stack gets an estimate.").exactOptional(),
    threshold: number2().min(0).describe("The change to the monthly bill above which these stacks, when set to deploy on merge, wait for a tick instead, whatever cost.threshold at the top level says. In the currency of the estimate.").exactOptional()
  }).superRefine((cost, context) => {
    if (cost.threshold !== undefined && cost.enabled === false)
      refuse(context, { kind: "cost-threshold-without-enabled" }, ["threshold"]);
  }).describe("The cost estimate of these stacks. Default: the top level cost.").exactOptional(),
  options: record(string2(), unknown()).describe("Named adapter options of the tool. Only an entry with tool takes them.").exactOptional()
}).superRefine((entry, context) => {
  if (entry.tool !== undefined)
    return;
  for (const name of Object.keys(entry.options ?? {})) {
    refuse(context, { kind: "option-without-tool", option: name }, ["options"]);
  }
});
var stackEntries = array(stackEntry).superRefine((entries, context) => {
  const seen = new Map;
  entries.forEach((entry, index) => {
    const id = stackId({
      path: entry.path,
      ...entry.name === undefined ? {} : { name: entry.name }
    });
    const first = seen.get(id);
    if (first === undefined)
      seen.set(id, index);
    else
      refuse(context, { kind: "same-entry", first, stackId: id }, [index]);
  });
});
function isTimeZone(name) {
  if (!/^[A-Za-z][A-Za-z0-9_+-]*(\/[A-Za-z0-9_+-]+)*$/.test(name))
    return false;
  if (/^(UTC|GMT)[+-]/i.test(name))
    return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: name });
    return true;
  } catch {
    return false;
  }
}
var RECENTLY_DEPLOYED_MAX = 50;
var DASHBOARD_SECTIONS = [
  "deploying",
  "updates",
  "pending",
  "drifted",
  "previewFailed",
  "inSync",
  "recentlyDeployed"
];
var IN_SYNC_SECTION = ["fold", "list", "off"];
var DESTROY_ALERT = ["destroys", "always"];
var PENDING_DETAIL = ["full", "compact", "names"];
var LOOKBACK_MAX = 1000;
var NAMES_MAX = 20;
var configSchema = strictObject({
  dashboard: strictObject({
    title: text.describe("Title of the dashboard issue. Every scan puts it back when it differs.").default("Sluiceway dashboard"),
    label: text.describe("Label the dashboard issue is found by.").default("sluiceway"),
    pin: boolean2().describe("Pin the dashboard issue on every scan when it is not pinned, best effort. false keeps it unpinned.").default(true),
    redact: boolean2().describe("Keep resource types, resource names and property names out of the issue. The summary stays full. Not access control.").default(false),
    personality: boolean2().describe("Show the header image and use the voice. false removes both.").default(true),
    readOnly: boolean2().describe("Draw no boxes: pending rows have none, there is no rescan box, and a line under the Pending heading says so. For a workflow that only scans.").default(false),
    showValues: array(text.superRefine((entry, context) => {
      const problem = showValuesEntryProblem(entry);
      if (problem !== undefined)
        refuse(context, { kind: "worded", text: problem });
    })).describe('Property paths whose old and new value may appear on the dashboard, as "old → new". Exact paths, or "*" for part of one name. Never a value the tool marks secret, and none at all with redact on.').default([]),
    recentlyDeployed: int().min(0).max(RECENTLY_DEPLOYED_MAX).describe("How many deploys the Recently deployed list shows, newest first, failed ones included. 0 leaves the list out.").default(10),
    timeZone: string2().superRefine((value, context) => {
      if (!isTimeZone(value))
        refuse(context, { kind: "not-a-time-zone", value });
    }).describe("The IANA time zone every time on the dashboard is shown in, such as Europe/Brussels. A time that stands alone says its offset from UTC, and the line under Recently deployed names the zone. The markers keep UTC.").default("UTC"),
    sections: array(_enum(DASHBOARD_SECTIONS)).superRefine((sections, context) => {
      sections.forEach((section, index) => {
        const first = sections.indexOf(section);
        if (first !== index)
          refuse(context, { kind: "section-named-twice", section, first }, [index]);
      });
    }).describe("The order of the sections, top to bottom: deploying, updates, pending, drifted, previewFailed, inSync, recentlyDeployed. The ones named come first in this order, and a section left out follows in the default order. Leaving a section out does not hide it.").default([...DASHBOARD_SECTIONS]),
    deployingSection: boolean2().describe("false takes the Deploying section off the page: its rows move to one closed fold at the end of the sections. The counts line and the header still count them.").default(true),
    driftedSection: boolean2().describe("false takes the Drifted section off the page: its rows move to the closed fold at the end of the sections, with no repair all box. A drifted row with a failure line, or with a resource gone that the destroy alert names, stays open under the Drifted heading.").default(true),
    inSyncSection: _enum(IN_SYNC_SECTION).describe("fold: the in sync rows in a fold, the default. list: every in sync row open. off: the section is off the page and its rows move to the closed fold at the end of the sections. A row with a failure line always stays open under the In sync heading.").default("fold"),
    zeroCounts: boolean2().describe("false leaves a count of 0 out of the counts line. The pending count always stays.").default(true),
    destroyAlert: _enum(DESTROY_ALERT).describe("destroys: the caution block above the pending rows is drawn when a pending stack deletes or replaces something, or a drifted stack has a resource gone. always: it is drawn on every body, and says so when nothing is destroyed. It cannot be turned off.").default("destroys"),
    pendingDetail: _enum(PENDING_DETAIL).describe("How much a pending row shows under its first line. full: everything, the default. compact: the first line, and only the lines no setting hides (the failure line and every delete and replace line) and the ones that say why a row has no box or a tick would not go. names: the stack id and its counts, without the preview link, and only the lines no setting hides.").default("full"),
    deployAll: boolean2().describe("false draws no deploy all box under the pending rows.").default(true),
    repairAll: boolean2().describe("false draws no repair all box under the drifted rows.").default(true),
    rescanBox: boolean2().describe("false draws no rescan box. A full scan is then started with Run workflow or the schedule.").default(true),
    footer: boolean2().describe("false leaves out the small line with the version and the docs link.").default(true)
  }).prefault({}),
  tickers: tickers.describe("Default tick rule: write, maintain, admin, or a list of usernames. A list narrows and never widens: a person on it still needs write access.").default("write"),
  deploys: boolean2().describe("false stops every deploy: resolve clears every ticked box with a note and starts nothing, and apply ends a deploy that was already started before the tool runs. Scans go on.").default(true),
  recordWriters: array(author).transform((logins) => [...new Set(logins)]).describe("Logins, an app as name[bot], whose open deployment records that name a dispatched or scheduled run are deployed by that run. The writer is who GitHub records as the creator of the record. Empty hands none on.").default([]),
  deployWindows: deployWindows.describe("When the stacks of this repo may go out, in the dashboard zone: a list of windows, each with days of the week, a start and an end. A tick outside every window waits for the next one to open, and so does a deploy on merge. Empty, the default, is any time. A stacks entry sets its own with stacks[].deployWindows.").default([]),
  freezes: array(deployFreeze).describe("Periods when nothing goes out, in the dashboard zone: each a start and an end as YYYY-MM-DDTHH:MM and an optional reason. A tick, a deploy on merge and a destroy wait for the end, and a deploy window after it, and go out at the first moment both allow. Empty, the default, freezes nothing.").default([]),
  ignore: array(ignoreEntry).describe("Globs matched against the stack id. An ignored stack has no row. An entry with a reason is listed with it under In sync.").default([]),
  scan: strictObject({
    unrelated: globs.describe("Globs for files that claim nothing and force nothing, such as **/*.md.").default([]),
    logDiff: boolean2().describe("Print the tool's own diff of every pending stack, values included, in that stack's group of the job log and nowhere else. Anyone who can read the repo can read its job logs. Costs one more tool run per pending stack.").default(false)
  }).prefault({}),
  drift: strictObject({
    enabled: boolean2().describe("Check every stack for drift in each scan that a schedule starts, or that a person starts with Run workflow: changes made to real infrastructure outside the code. A stack with drift gets a row with a box, and a tick deploys the code as it is, which puts it back. Costs one more tool run per stack in those scans.").default(false)
  }).prefault({}),
  valueFingerprint: boolean2().describe("Cover the values a row does not show with a fingerprint on the row, so a tick approves them too: a value that changed between the tick and the deploy stops the deploy, and the row says so without naming the value. A value the tool marks secret never reaches the fingerprint. Turn it off, here or per stack, where a program makes a value that differs on every run.").default(true),
  policies: policyPaths.describe("Directories or files of Rego policies, relative to the repo root, that every pending stack's preview is tested against with conftest, which the workflow installs. A policy that fails takes the box off the row until it passes and stops a deploy on merge. Empty runs nothing.").default([]),
  cost: strictObject({
    enabled: boolean2().describe("Estimate what each pending change of an OpenTofu or Terraform stack costs a month, with the Infracost CLI the workflow installs, and show it on the row as a change to the monthly bill. The CLI sends resource types, regions and quantities to its pricing API, never a value or a credential. A Pulumi, Helm or Kubernetes manifests stack gets no estimate. An estimate that fails is a missing line, never a failed scan.").default(false),
    threshold: number2().min(0).describe("The change to the monthly bill above which a stack set to deploy on merge waits for a tick instead, and its row says why. In the currency of the estimate, USD unless the workflow sets another. A change whose estimate failed waits too. Needs enabled: true.").exactOptional()
  }).superRefine((cost, context) => {
    if (cost.threshold !== undefined && !cost.enabled)
      refuse(context, { kind: "cost-threshold-without-enabled" }, ["threshold"]);
  }).prefault({}),
  attribution: strictObject({
    lookback: int().min(1).max(LOOKBACK_MAX).describe("How many of the newest commits a job walks to say which pull requests made a row pending. A stack whose last deploy lies further back gets a line that says earlier changes exist. Each 100 commits cost one more GraphQL request.").default(LOOKBACK),
    names: int().min(0).max(NAMES_MAX).describe("How many pull requests and direct pushes a row and a line of Recently deployed name, newest first. The rest is a count. 0 names none and always counts.").default(NAMED_ON_A_ROW)
  }).prefault({}),
  phases: array(phaseName).describe("Names of the phases stacks deploy in, in order. A stack in a phase depends on every stack in every earlier phase.").default([]),
  stacks: stackEntries.describe("Settings for stacks that discovery found. An entry never creates a stack, except an entry with tool, which declares one.").default([]),
  discovery: record(string2(), boolean2()).describe("Switches for what discovery finds on its own. See the configuration reference for the keys.").default({}),
  mergeAndDeploy: strictObject({
    authors: array(author).transform((logins) => [...new Set(logins)]).describe("Logins whose open pull requests may be merged and deployed with one tick, such as renovate[bot]. Empty turns it off.").default([]),
    preview: boolean2().describe("Preview the branch of each update waiting to merge, and show what it would change on its row. One extra preview per update on every scan that lists it.").default(false)
  }).prefault({}),
  notify: strictObject({
    events: array(_enum(NOTIFY_EVENTS)).transform((events) => [...new Set(events)]).describe("The events a notification is sent on, to each channel the step's inputs name: pending (stacks newly pending after a scan), drift (stacks newly drifted), deployed, failed and refused (a tick that deployed nothing).").default([...DEFAULT_NOTIFY_EVENTS])
  }).prefault({})
}).superRefine((config, context) => {
  config.phases.forEach((phase, index) => {
    const first = config.phases.indexOf(phase);
    if (first !== index)
      refuse(context, { kind: "phase-named-twice", phase, first }, ["phases", index]);
  });
  config.stacks.forEach((entry, index) => {
    if (typeof entry.phase !== "string" || config.phases.includes(entry.phase))
      return;
    refuse(context, { kind: "unknown-phase", phase: entry.phase, phases: config.phases }, [
      "stacks",
      index,
      "phase"
    ]);
  });
});

class ConfigError extends Error {
  issues;
  problems;
  file;
  constructor(issues, file = "sluiceway.yaml") {
    const all = issues.map((issue) => typeof issue === "string" ? { kind: "worded", text: issue, path: [] } : issue);
    const problems = all.map(configProblemText);
    super(configErrorText(file, problems));
    this.name = "ConfigError";
    this.issues = all;
    this.problems = problems;
    this.file = file;
  }
}
function parseConfig(text) {
  const raw = text === undefined ? null : readYaml(text);
  const result = configSchema.safeParse(raw ?? {});
  if (!result.success) {
    const found = result.error.issues.flatMap((issue) => classify(issue, raw));
    throw new ConfigError(inFileOrder(found, raw).map((one) => one.issue));
  }
  return result.data;
}
function readYaml(text) {
  const lineCounter = new $LineCounter;
  const document = $parseDocument(text, { lineCounter, prettyErrors: false });
  if (document.errors.length > 0) {
    throw new ConfigError(document.errors.map((error) => {
      const { line, col } = lineCounter.linePos(error.pos[0]);
      return { kind: "not-yaml", line, column: col, detail: error.message, path: [] };
    }));
  }
  return document.toJS();
}
function refuse(context, wrong, path) {
  context.addIssue({
    code: "custom",
    ...path === undefined ? {} : { path },
    params: { wrong }
  });
}
function classify(issue, raw) {
  const path = issue.path;
  const value = valueAt(raw, path);
  const one = (wrong) => [{ issue: { ...wrong, path }, at: path }];
  const inner = (branch) => issue.code === "invalid_union" ? (issue.errors[branch] ?? []).flatMap((error) => classify({ ...error, path: [...path, ...error.path] }, raw)) : [];
  const key = path.at(-1);
  if (issue.code === "unrecognized_keys") {
    const known = knownKeys(path);
    const unknown2 = (name) => {
      if (path.length === 1 && path[0] === "drift" && name === "schedule")
        return { kind: "drift-schedule" };
      if (path.length === 1 && path[0] === "notify")
        return { kind: "notify-unknown-key", key: name, known };
      if (path.length > 0 && RESERVED_KEYS.includes(name))
        return { kind: "reserved-key", key: name };
      return { kind: "unknown-key", key: name, known };
    };
    return issue.keys.map((name) => ({
      issue: { ...unknown2(name), path },
      at: [...path, name]
    }));
  }
  if (value === undefined && key === "path")
    return one({ kind: "required-stack-path" });
  if (path[0] === "ignore" && path.length === 3) {
    const glob = valueAt(raw, [...path.slice(0, -1), "glob"]);
    if (value === undefined && key === "reason")
      return one({ kind: "required-ignore-reason", glob });
    if (value === undefined && key === "glob")
      return one({ kind: "required-ignore-glob" });
  }
  if (key === "recentlyDeployed" && path[0] === "dashboard") {
    return one({ kind: "not-a-count", counts: "lines", min: 0, max: RECENTLY_DEPLOYED_MAX, value });
  }
  if (key === "lookback" && path[0] === "attribution") {
    return one({ kind: "not-a-count", counts: "commits", min: 1, max: LOOKBACK_MAX, value });
  }
  if (key === "names" && path[0] === "attribution") {
    return one({ kind: "not-a-count", counts: "names", min: 0, max: NAMES_MAX, value });
  }
  if (key === "threshold" && path.includes("cost") && issue.code !== "custom") {
    return one({ kind: "not-an-amount", value });
  }
  if (issue.code === "invalid_type" && key === "cost" && path[0] === "stacks") {
    return one({ kind: "stack-cost-not-a-mapping", value });
  }
  if (key === "previewTimeout" && issue.code !== "custom") {
    return one({ kind: "not-a-count", counts: "minutes", min: 1, value });
  }
  if (issue.code === "invalid_union" && path[0] === "ignore") {
    const branch = typeof value === "string" ? 0 : isMapping(value) ? 1 : undefined;
    return branch === undefined ? one({ kind: "not-an-ignore-entry", value }) : inner(branch);
  }
  if (issue.code === "invalid_union" && key === "dependsOn") {
    return Array.isArray(value) ? inner(1) : one({ kind: "not-a-depends-on", value, auto: DEPENDS_ON_AUTO });
  }
  if (issue.code === "invalid_union" && key === "phase") {
    return isMapping(value) ? inner(1) : one({ kind: "not-a-phase", value });
  }
  if (issue.code === "invalid_type" && key === "drift" && path[0] === "stacks") {
    return one({ kind: "stack-drift-not-a-mapping", value });
  }
  if (issue.code === "invalid_union") {
    return Array.isArray(value) ? inner(1) : one({ kind: "not-a-tick-rule", value });
  }
  if (key === "deploy" && path[0] === "stacks") {
    return one({ kind: "not-a-deploy-trigger", value });
  }
  const inWindow = path.includes("deployWindows");
  if (inWindow && issue.code === "invalid_value" && path.at(-2) === "days") {
    return one({ kind: "not-a-weekday", value });
  }
  if (inWindow && (key === "from" || key === "to") && value !== undefined) {
    return one({ kind: "not-a-clock-time", value });
  }
  if (path[0] === "freezes" && (key === "from" || key === "to") && value !== undefined) {
    return one({ kind: "not-a-date-time", value });
  }
  if (issue.code === "invalid_value" && path[0] === "dashboard") {
    return one({ kind: "not-one-of", value, choices: issue.values.map(String) });
  }
  if (issue.code === "invalid_value" && path[0] === "notify") {
    return one({ kind: "not-an-event", value, events: NOTIFY_EVENTS });
  }
  if (issue.code === "invalid_format" && (path[0] === "phases" || key === "phase")) {
    return one({ kind: "not-a-phase-name", value });
  }
  if (issue.code === "invalid_format" && (path[0] === "mergeAndDeploy" || path[0] === "recordWriters")) {
    return one({ kind: "not-a-login", value });
  }
  if (issue.code === "invalid_format") {
    return one(String(value).includes("/") ? { kind: "a-team", value } : { kind: "not-a-username", value });
  }
  if (issue.code === "too_small") {
    return one(issue.origin === "array" ? key === "days" ? { kind: "no-days" } : { kind: "no-tickers" } : key === "path" ? { kind: "empty-stack-path" } : { kind: "empty" });
  }
  if (issue.code === "invalid_type") {
    return one({ kind: "wrong-type", expected: issue.expected, value });
  }
  const wrong = issue.code === "custom" ? issue.params?.wrong : undefined;
  return one(wrong === undefined ? { kind: "worded", text: issue.message } : wrong);
}
function isMapping(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function valueAt(raw, path) {
  let value = raw;
  for (const segment of path) {
    if (typeof value !== "object" || value === null)
      return;
    value = value[segment];
  }
  return value;
}
function inFileOrder(found, raw) {
  const position = (path) => {
    let value = raw;
    return path.map((segment) => {
      const keys = typeof value === "object" && value !== null ? Object.keys(value) : [];
      const index = keys.indexOf(String(segment));
      value = index === -1 ? undefined : value[String(segment)];
      return index === -1 ? keys.length : index;
    });
  };
  const compare = (a, b) => {
    for (let i = 0;i < Math.min(a.length, b.length); i++) {
      const difference = (a[i] ?? 0) - (b[i] ?? 0);
      if (difference !== 0)
        return difference;
    }
    return a.length - b.length;
  };
  return found.map((one) => ({ one, position: position(one.at) })).sort((a, b) => compare(a.position, b.position)).map(({ one }) => one);
}
var RESERVED_KEYS = [];
function knownKeys(path) {
  let schema = configSchema;
  for (const segment of path) {
    schema = unwrap(schema);
    if (schema instanceof ZodObject)
      schema = schema.shape[String(segment)];
    else if (schema instanceof ZodArray)
      schema = schema.element;
  }
  schema = unwrap(schema);
  return schema instanceof ZodObject ? Object.keys(schema.shape) : [];
}
function unwrap(schema) {
  let inner = schema;
  while (inner instanceof ZodDefault || inner instanceof ZodPrefault || inner instanceof ZodExactOptional) {
    inner = inner.unwrap();
  }
  if (inner instanceof ZodUnion) {
    return inner.options.find((option) => option instanceof ZodObject) ?? inner;
  }
  return inner;
}
function ignoreGlob(entry) {
  return typeof entry === "string" ? entry : entry.glob;
}
function ignoredStacks(config, found) {
  return found.map(stackId).sort((a, b) => a < b ? -1 : a > b ? 1 : 0).flatMap((id) => {
    const entry = config.ignore.find((one) => globMatcher([ignoreGlob(one)])(id));
    return entry === undefined || typeof entry === "string" ? [] : [{ stackId: id, reason: entry.reason }];
  });
}
function withIds(config, found) {
  const given = new Map;
  const issues = [];
  config.stacks.forEach((entry, index) => {
    if (entry.id === undefined)
      return;
    const path = ["stacks", index, "id"];
    const covered = found.filter((stack) => covers(entry, stack));
    const [only] = covered;
    if (only === undefined) {
      issues.push({ kind: "id-covers-no-stack", id: entry.id, path });
    } else if (covered.length > 1) {
      issues.push({ kind: "id-covers-stacks", stackIds: covered.map(stackId), path });
    } else if (given.has(only)) {
      issues.push({
        kind: "id-given-twice",
        stackId: stackId(only),
        id: given.get(only) ?? "",
        path
      });
    } else {
      given.set(only, entry.id);
    }
  });
  const taken = new Set(found.filter((stack) => !given.has(stack)).map(stackId));
  config.stacks.forEach((entry, index) => {
    if (entry.id === undefined || ![...given.values()].includes(entry.id))
      return;
    if (taken.has(entry.id)) {
      issues.push({ kind: "id-taken", id: entry.id, path: ["stacks", index, "id"] });
    }
    taken.add(entry.id);
  });
  if (issues.length > 0)
    throw new ConfigError(once(issues));
  return found.map((stack) => {
    const id = given.get(stack);
    return id === undefined ? stack : { ...stack, id };
  });
}
function once(issues) {
  const seen = new Set;
  return issues.filter((issue) => {
    const key = JSON.stringify(issue);
    if (seen.has(key))
      return false;
    seen.add(key);
    return true;
  });
}
var DEFAULT_ENVIRONMENT = "sluiceway";
function applyConfig(config, found) {
  const stacks = knownStacks(found, config.ignore.map(ignoreGlob));
  const misses = config.stacks.flatMap((entry, index) => {
    const inPath = stacks.filter((stack) => stack.path === entry.path);
    if (inPath.some((stack) => covers(entry, stack)))
      return [];
    const ignored = found.filter((stack) => covers(entry, stack));
    return [{ ...miss(entry, inPath, ignored), path: ["stacks", index] }];
  });
  if (misses.length > 0)
    throw new ConfigError(misses);
  const phases = phasesOf(config, stacks);
  if (phases.issues.length > 0)
    throw new ConfigError(phases.issues);
  const dependencyIssues = checkDependsOn(config, found, stacks, phases.phaseOf);
  if (dependencyIssues.length > 0)
    throw new ConfigError(dependencyIssues);
  const derived = phaseDependencies(config.phases, phases.phaseOf);
  const costIssues = checkCostThresholds(config, stacks);
  if (costIssues.length > 0)
    throw new ConfigError(costIssues);
  return stacks.map((stack) => {
    const entries = entriesOf(config, stack);
    const id = stackId(stack);
    const previewTimeout = entries.findLast((entry) => entry.previewTimeout)?.previewTimeout;
    const drift = entries.findLast((entry) => entry.drift)?.drift?.enabled;
    const deploy = entries.findLast((entry) => entry.deploy)?.deploy;
    const valueFingerprint = entries.findLast((entry) => entry.valueFingerprint !== undefined)?.valueFingerprint;
    const envFile = entries.findLast((entry) => entry.envFile !== undefined)?.envFile;
    const windows = entries.findLast((entry) => entry.deployWindows !== undefined)?.deployWindows ?? config.deployWindows;
    const createInBackend = entries.findLast((entry) => entry.createInBackend !== undefined)?.createInBackend;
    const cost = costOf(entries);
    const phase = phases.phaseOf.get(id);
    const from = phases.from.get(id);
    const policies = [
      ...new Set([...config.policies, ...entries.flatMap((entry) => entry.policies ?? [])])
    ];
    return {
      stack,
      environment: entries.findLast((entry) => entry.environment)?.environment ?? DEFAULT_ENVIRONMENT,
      tickers: entries.findLast((entry) => entry.tickers)?.tickers ?? config.tickers,
      inputs: [...new Set(entries.flatMap((entry) => entry.inputs ?? []))],
      ...previewTimeout === undefined ? {} : { previewTimeout },
      ...dependsOnOf(entries, derived.get(id)),
      ...phase === undefined ? {} : { phase },
      ...from === undefined ? {} : { phaseFrom: from },
      ...entries.some((entry) => entry.dependsOn === DEPENDS_ON_AUTO) ? { dependsOnAuto: true } : {},
      ...drift === undefined ? {} : { drift },
      ...deploy === "on-merge" ? { deploy } : {},
      ...valueFingerprint === undefined ? {} : { valueFingerprint },
      ...envFile === undefined ? {} : { envFile },
      ...windows.length === 0 ? {} : { deployWindows: windows },
      ...config.freezes.length === 0 ? {} : { freezes: config.freezes },
      ...policies.length === 0 ? {} : { policies },
      ...createInBackend === true ? { createInBackend } : {},
      ...cost === undefined ? {} : { cost }
    };
  });
}
function costOf(entries) {
  const enabled = entries.findLast((entry) => entry.cost?.enabled !== undefined)?.cost?.enabled;
  const threshold = entries.findLast((entry) => entry.cost?.threshold !== undefined)?.cost?.threshold;
  if (enabled === undefined && threshold === undefined)
    return;
  return {
    ...enabled === undefined ? {} : { enabled },
    ...threshold === undefined ? {} : { threshold }
  };
}
function checkCostThresholds(config, stacks) {
  const refused = new Set;
  for (const stack of stacks) {
    const entries = entriesOf(config, stack);
    const cost = costOf(entries);
    if (cost?.threshold === undefined || (cost.enabled ?? config.cost.enabled))
      continue;
    const setBy = entries.findLast((entry) => entry.cost?.threshold !== undefined);
    if (setBy !== undefined)
      refused.add(config.stacks.indexOf(setBy));
  }
  return [...refused].sort((a, b) => a - b).map((index) => ({
    kind: "cost-threshold-without-enabled",
    path: ["stacks", index, "cost", "threshold"]
  }));
}
function entriesOf(config, stack) {
  return config.stacks.filter((entry) => covers(entry, stack)).sort((a, b) => Number(a.name !== undefined) - Number(b.name !== undefined));
}
function dependsOnOf(entries, fromPhases = []) {
  const ids = [
    ...new Set([...entries.flatMap((entry) => listed(entry.dependsOn)), ...fromPhases])
  ].sort(byCodeUnit);
  return ids.length === 0 ? {} : { dependsOn: ids };
}
function phasesOf(config, stacks) {
  const phaseOf = new Map;
  const from = new Map;
  const issues = [];
  for (const stack of stacks) {
    const entry = entriesOf(config, stack).findLast((one) => one.phase !== undefined);
    if (entry?.phase === undefined)
      continue;
    const id = stackId(stack);
    if (typeof entry.phase === "string") {
      phaseOf.set(id, entry.phase);
      continue;
    }
    const path = ["stacks", config.stacks.indexOf(entry), "phase"];
    const key = entry.phase.from;
    const read = stack.phaseKeys?.[key];
    if (read === undefined) {
      issues.push({ kind: "no-phase-key", stackId: id, key, path });
    } else if (!config.phases.includes(read)) {
      issues.push({ kind: "phase-key-unknown", stackId: id, key, phases: config.phases, path });
    } else {
      phaseOf.set(id, read);
      from.set(id, key);
    }
  }
  return { phaseOf, from, issues: once(issues) };
}
function listed(dependsOn) {
  return Array.isArray(dependsOn) ? dependsOn : [];
}
function checkDependsOn(config, found, stacks, phaseOf) {
  const known = new Set(stacks.map(stackId));
  const all = new Set(found.map(stackId));
  const issues = config.stacks.flatMap((entry, index) => listed(entry.dependsOn).flatMap((id, at) => {
    const path = ["stacks", index, "dependsOn", at];
    if (all.has(id) && !known.has(id)) {
      const reason = ignoredStacks(config, found).find((one) => one.stackId === id)?.reason;
      return [
        {
          kind: "depends-on-ignored",
          stackId: id,
          ...reason === undefined ? {} : { reason },
          path
        }
      ];
    }
    if (!known.has(id)) {
      const example = stacks[0] ? stackId(stacks[0]) : undefined;
      return [
        {
          kind: "depends-on-unknown",
          stackId: id,
          ...example === undefined ? {} : { example },
          path
        }
      ];
    }
    const self = stacks.find((stack) => stackId(stack) === id);
    if (self && covers(entry, self))
      return [{ kind: "depends-on-itself", stackId: id, path }];
    const earlier = stacks.filter((stack) => covers(entry, stack)).map(stackId).sort(byCodeUnit).find((one) => throughPhase(config.phases, phaseOf, id, one));
    if (earlier !== undefined)
      return [
        {
          kind: "depends-on-earlier-phase",
          stackId: id,
          phase: phaseOf.get(id) ?? "",
          stack: earlier,
          stackPhase: phaseOf.get(earlier) ?? "",
          path
        }
      ];
    return [];
  }));
  if (issues.length > 0)
    return issues;
  const edges = new Map;
  for (const stack of stacks) {
    const id = stackId(stack);
    const at = config.phases.indexOf(phaseOf.get(id) ?? "");
    const earlierPhases = at === -1 ? [] : config.phases.slice(0, at).map(phaseNode);
    edges.set(id, [...dependsOnOf(entriesOf(config, stack)).dependsOn ?? [], ...earlierPhases]);
  }
  for (const phase of config.phases) {
    edges.set(phaseNode(phase), [...phaseOf].flatMap(([id, one]) => one === phase ? [id] : []));
  }
  return dependencyCircles(edges).map((circle) => ({
    kind: "depends-on-circle",
    circle: circle.map((node) => isPhaseNode(node) ? { phase: phaseOfNode(node) } : { stack: node }),
    path: []
  }));
}
var PHASE_NODE = "￿";
var phaseNode = (phase) => `${PHASE_NODE}${phase}`;
var isPhaseNode = (node) => node.startsWith(PHASE_NODE);
var phaseOfNode = (node) => node.slice(PHASE_NODE.length);
function dependencyCircles(edges) {
  const circles = new Map;
  const walk = (path) => {
    const last = path[path.length - 1] ?? "";
    for (const next of edges.get(last) ?? []) {
      const at = path.indexOf(next);
      if (at === -1) {
        walk([...path, next]);
        continue;
      }
      const circle = path.slice(at);
      const start = circle.indexOf([...circle].sort(byCodeUnit)[0] ?? "");
      const turned = [...circle.slice(start), ...circle.slice(0, start)];
      const key = [...turned].sort(byCodeUnit).join(`
`);
      if (!circles.has(key))
        circles.set(key, [...turned, turned[0] ?? ""]);
    }
  };
  for (const id of [...edges.keys()].sort(byCodeUnit))
    walk([id]);
  return [...circles.values()].sort((a, b) => byCodeUnit(a[0] ?? "", b[0] ?? ""));
}
function covers(entry, stack) {
  return entry.path === stack.path && (entry.name === undefined || entry.name === stack.name);
}
function miss(entry, inPath, ignored) {
  if (ignored.length > 0)
    return { kind: "entry-only-ignored", stackIds: ignored.map(stackId) };
  if (entry.name === undefined || inPath.length === 0) {
    return { kind: "entry-no-stack", stackPath: entry.path };
  }
  return {
    kind: "entry-no-named-stack",
    name: entry.name,
    stackPath: entry.path,
    names: inPath.flatMap((stack) => stack.name === undefined ? [] : [stack.name])
  };
}

// src/adapters/helm/discover.ts
import { readFileSync, statSync } from "node:fs";
import { isAbsolute, join, normalize, relative, sep } from "node:path";

// src/adapters/helm/options.ts
var text2 = string2().min(1);
var RELEASE = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
var NAMESPACE = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
var LOCAL_CHART = /^\.\.?(\/|$)/;
var REFERENCE = /^(oci:\/\/|https?:\/\/)[^\s]+$|^[A-Za-z0-9][\w.-]*\/[\w.-]+$/;
var EXACT = /^v?\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;
var helmOptionsSchema = strictObject({
  release: text2.max(53).regex(RELEASE).describe("The name of the Helm release. Helm's rule: lower case letters, digits, - and ."),
  namespace: text2.max(63).regex(NAMESPACE).describe("The namespace of the release, passed with --namespace to every command."),
  chart: text2.regex(new RegExp(`${LOCAL_CHART.source}|${REFERENCE.source}`)).describe('The chart: a path relative to the directory of the stack that starts with "./" or "../", or a chart reference such as repo/name or oci://registry/name.'),
  version: text2.regex(EXACT).describe("The exact version of a chart reference. A local chart takes none.").exactOptional(),
  valuesFiles: array(text2).describe("Values files, relative to the directory of the stack, passed with --values in this order to every command.").default([]),
  createNamespace: boolean2().describe("Create the namespace of the release when it is not there, with --create-namespace on the deploy. The preview works without it.").default(false)
});
var HELM = "helm";
function isHelmOptions(options) {
  return options.tool === HELM;
}
var PATTERN_PROBLEMS = {
  release: 'expected a release name of lower case letters, digits, "-" and ".", that starts and ends with a letter or a digit, at most 53 characters.',
  namespace: 'expected a namespace of lower case letters, digits and "-", that starts and ends with a letter or a digit, at most 63 characters.',
  chart: 'expected a local chart as a path that starts with "./" or "../", or a chart reference such as repo/name or oci://registry/name.',
  version: "expected an exact chart version, such as 1.2.3."
};
function parseHelmOptions(raw, index) {
  const at = `stacks[${index}].options`;
  const parsed = helmOptionsSchema.safeParse(raw ?? {});
  if (!parsed.success) {
    const known = Object.keys(helmOptionsSchema.shape).join(", ");
    const order = Object.keys(helmOptionsSchema.shape);
    const rank = (issue) => issue.code === "unrecognized_keys" ? -1 : order.indexOf(String(issue.path[0]));
    const issues = [...parsed.error.issues].sort((a, b) => rank(a) - rank(b));
    const problems = issues.flatMap((issue) => {
      if (issue.code === "unrecognized_keys") {
        return issue.keys.map((key) => `${at}: unknown option ${JSON.stringify(key)}. Known options for helm: ${known}.`);
      }
      const [name] = issue.path;
      const where = `${at}${issue.path.map((part) => typeof part === "number" ? `[${part}]` : `.${String(part)}`).join("")}`;
      if (name === "createNamespace")
        return [`${where}: expected true or false.`];
      if (issue.code === "invalid_type" && issue.input === undefined) {
        return [`${where}: required for tool: helm.`];
      }
      if (issue.code === "too_small")
        return [`${where}: must not be empty.`];
      if (issue.path.length === 1 && name === "valuesFiles") {
        return [`${where}: expected a list of file names.`];
      }
      if (issue.code === "invalid_type")
        return [`${where}: expected text.`];
      return [`${where}: ${PATTERN_PROBLEMS[String(name)] ?? "expected something else."}`];
    });
    return { ok: false, problems: [...new Set(problems)] };
  }
  const options = parsed.data;
  const local = LOCAL_CHART.test(options.chart);
  if (local && options.version !== undefined) {
    return {
      ok: false,
      problems: [
        `${at}.version: only a chart reference takes a version. A local chart is used as the repo holds it.`
      ]
    };
  }
  if (!local && options.version === undefined) {
    return {
      ok: false,
      problems: [
        `${at}.version: required for a chart reference, so that the deploy installs the chart the preview saw.`
      ]
    };
  }
  return { ok: true, options };
}

// src/adapters/helm/discover.ts
var WHAT_PATH_IS = "An entry with tool: helm names the directory its chart and values files are relative to.";
function discoverHelm(root, config) {
  const stacks = [];
  const optionProblems = [];
  const problems = [];
  config.stacks.forEach((entry, index) => {
    if (entry.tool !== HELM)
      return;
    const parsed = parseHelmOptions(entry.options, index);
    if (!parsed.ok) {
      optionProblems.push(...parsed.problems);
      return;
    }
    const { options } = parsed;
    const dir = join(root, entry.path);
    const shown = JSON.stringify(entry.path);
    if (!isDirectory(dir)) {
      problems.push(`stacks[${index}]: ${shown} is not a directory of the repo. ${WHAT_PATH_IS}`);
      return;
    }
    const before = problems.length;
    const inRepo = (file) => {
      const fromRoot = relative(root, normalize(join(dir, file)));
      if (fromRoot === ".." || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) {
        return;
      }
      return fromRoot === "" ? "." : fromRoot.split(sep).join("/");
    };
    let chart;
    if (LOCAL_CHART.test(options.chart)) {
      const where = `stacks[${index}].options.chart: ${JSON.stringify(options.chart)}`;
      const chartDir = inRepo(options.chart);
      if (chartDir === undefined) {
        problems.push(`${where} must stay inside the repo.`);
      } else {
        const found = chartFile(root, chartDir);
        if (found === "missing") {
          problems.push(`${where} is not a chart in ${shown}: it holds no Chart.yaml.`);
        } else if (found === "unreadable") {
          problems.push(`stacks[${index}].options.chart: the Chart.yaml of ${JSON.stringify(options.chart)} could not be read as YAML.`);
        } else {
          chart = { chartDir, builds: chartTree(root, chartDir, found) };
        }
      }
    }
    options.valuesFiles.forEach((file, at) => {
      const where = `stacks[${index}].options.valuesFiles[${at}]: ${JSON.stringify(file)}`;
      if (isAbsolute(file)) {
        problems.push(`${where} must be relative to the directory of the stack.`);
        return;
      }
      const fromRoot = inRepo(file);
      if (fromRoot === undefined) {
        problems.push(`${where} must stay inside the repo.`);
        return;
      }
      if (!isFile(join(root, fromRoot)))
        problems.push(`${where} is not a file in ${shown}.`);
    });
    if (problems.length > before)
      return;
    const bag = {
      tool: HELM,
      ...options,
      ...chart === undefined ? { builds: [] } : chart
    };
    stacks.push({
      path: entry.path,
      ...entry.name === undefined ? {} : { name: entry.name },
      options: { ...bag }
    });
  });
  if (optionProblems.length === 0 && problems.length > 0)
    throw new DiscoveryError(problems);
  return { stacks, optionProblems };
}
function chartFile(root, chartDir) {
  let text;
  try {
    text = readFileSync(join(root, chartDir, "Chart.yaml"), "utf8");
  } catch {
    return "missing";
  }
  try {
    const chart = $parse(text);
    const dependencies = typeof chart === "object" && chart !== null ? chart.dependencies : undefined;
    if (!Array.isArray(dependencies))
      return [];
    return dependencies.map((one) => {
      const { name, repository } = typeof one === "object" && one !== null ? one : {};
      return {
        name: typeof name === "string" ? name : "",
        repository: typeof repository === "string" ? repository : ""
      };
    });
  } catch {
    return "unreadable";
  }
}
var LOCAL_DEPENDENCY = "file://";
function chartTree(root, top, topDependencies) {
  const levels = new Map;
  const builds = [];
  const visit = (chartDir, dependencies, path) => {
    const known = levels.get(chartDir);
    if (known !== undefined)
      return known;
    let level = 0;
    for (const { repository } of dependencies) {
      if (!repository.startsWith(LOCAL_DEPENDENCY))
        continue;
      const target = relative(root, normalize(join(root, chartDir, repository.slice(LOCAL_DEPENDENCY.length))));
      if (target === ".." || target.startsWith(`..${sep}`) || isAbsolute(target))
        continue;
      const dependencyDir = target === "" ? "." : target.split(sep).join("/");
      if (path.includes(dependencyDir))
        continue;
      const found = chartFile(root, dependencyDir);
      if (typeof found === "string")
        continue;
      level = Math.max(level, visit(dependencyDir, found, [...path, dependencyDir]) + 1);
    }
    levels.set(chartDir, level);
    if (dependencies.length > 0)
      builds.push({ chart: chartDir, level });
    return level;
  };
  visit(top, topDependencies, [top]);
  return builds.sort((a, b) => a.level - b.level || (a.chart < b.chart ? -1 : a.chart > b.chart ? 1 : 0));
}
function isDirectory(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}
function isFile(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

// src/adapters/kubectl/discover.ts
import { join as join3 } from "node:path";

// src/adapters/kubectl/options.ts
var text3 = string2().min(1);
var NAMESPACE2 = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
var NAMESPACE_PROBLEM = 'expected a namespace of lower case letters, digits and "-", that starts and ends with a letter or a digit, at most 63 characters.';
var FIELD_MANAGER = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
var FIELD_MANAGER_PROBLEM = 'expected a field manager of letters, digits, ".", "_" and "-", that starts with a letter or a digit, at most 128 characters.';
var kubectlOptionsSchema = strictObject({
  context: text3.describe("The kubeconfig context of the stack, passed with --context to every command. Without it, the current context of the kubeconfig.").exactOptional(),
  namespace: text3.max(63).regex(NAMESPACE2).describe("The namespace of objects that name none, passed with --namespace to every command. Without it, the namespace of the context.").exactOptional(),
  recursive: boolean2().describe("Read the manifests of every subdirectory too, as kubectl apply -R does. Only for a directory of manifests. Default false: one level.").exactOptional(),
  prune: boolean2().describe("Delete an object taken out of the manifests when the stack deploys, and show it as a delete on the row. Sluiceway keeps the list of the stack's objects in a ConfigMap next to them. Default false.").exactOptional(),
  forceConflicts: boolean2().describe("Take a field that another field manager holds, with --force-conflicts on the preview and the deploy. Without it such a field fails the preview. Default false.").exactOptional(),
  fieldManager: text3.max(128).regex(FIELD_MANAGER).describe("The field manager of the preview and the deploy, passed with --field-manager. Without it, kubectl's own, kubectl.").exactOptional()
});
var KUBECTL = "kubectl";
var SWITCHES = new Set(["recursive", "prune", "forceConflicts"]);
function isKubectlOptions(options) {
  return options.tool === KUBECTL;
}
function parseKubectlOptions(raw, index) {
  const parsed = kubectlOptionsSchema.safeParse(raw ?? {});
  if (parsed.success)
    return { ok: true, options: parsed.data };
  const at = `stacks[${index}].options`;
  const known = Object.keys(kubectlOptionsSchema.shape).join(", ");
  const issues = [...parsed.error.issues].sort((a, b) => Number(b.code === "unrecognized_keys") - Number(a.code === "unrecognized_keys"));
  const problems = issues.flatMap((issue) => {
    if (issue.code === "unrecognized_keys") {
      return issue.keys.map((key) => `${at}: unknown option ${JSON.stringify(key)}. Known options for kubectl: ${known}.`);
    }
    const name = String(issue.path[0]);
    const where = `${at}${issue.path.map((part) => `.${String(part)}`).join("")}`;
    if (SWITCHES.has(name))
      return [`${where}: expected true or false.`];
    if (issue.code === "too_small")
      return [`${where}: must not be empty.`];
    if (issue.code === "too_big" || issue.code === "invalid_format") {
      return [`${where}: ${name === "fieldManager" ? FIELD_MANAGER_PROBLEM : NAMESPACE_PROBLEM}`];
    }
    return [`${where}: expected text.`];
  });
  return { ok: false, problems };
}

// src/adapters/kubectl/render.ts
import { readdirSync, readFileSync as readFileSync2 } from "node:fs";
import { basename, join as join2 } from "node:path";
var KUSTOMIZATION = new Set(["kustomization.yaml", "kustomization.yml", "Kustomization"]);
var MANIFEST = /\.(yaml|yml|json)$/;
function isKustomization(file) {
  return KUSTOMIZATION.has(file);
}
function isManifestFile(file) {
  return MANIFEST.test(file) && !isKustomization(file);
}
function manifestFiles(dir, recursive = false) {
  return walk(dir, recursive).filter((file) => isManifestFile(basename(file)));
}
function nestedKustomizations(dir) {
  return [
    ...new Set(walk(dir, true).filter((file) => file.includes("/") && isKustomization(basename(file))).map((file) => file.slice(0, file.lastIndexOf("/"))))
  ];
}
function walk(dir, recursive, prefix = "") {
  let entries;
  try {
    entries = readdirSync(join2(dir, prefix), { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.sort((a, b) => byCodeUnit(a.name, b.name)).flatMap((entry) => {
    const path = prefix === "" ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory())
      return recursive ? walk(dir, true, path) : [];
    return entry.isFile() ? [path] : [];
  });
}
function filesIn(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch {
    return;
  }
}

// src/adapters/kubectl/discover.ts
var NAMES = "An entry with tool: kubectl names a directory of manifests or a kustomization.";
function discoverKubectl(root, config) {
  const stacks = [];
  const optionProblems = [];
  const problems = [];
  config.stacks.forEach((entry, index) => {
    if (entry.tool !== KUBECTL)
      return;
    const parsed = parseKubectlOptions(entry.options, index);
    if (!parsed.ok) {
      optionProblems.push(...parsed.problems);
      return;
    }
    const shown = JSON.stringify(entry.path);
    const dir = join3(root, entry.path);
    const files = filesIn(dir);
    if (files === undefined) {
      problems.push(`stacks[${index}]: ${shown} is not a directory of the repo. ${NAMES}`);
      return;
    }
    const recursive = parsed.options.recursive === true;
    if (recursive && files.some(isKustomization)) {
      problems.push(`stacks[${index}]: ${shown} is a kustomization, which lists its own files. recursive is for a directory of manifests: take it out of the options.`);
      return;
    }
    const nested = recursive ? nestedKustomizations(dir) : [];
    if (nested.length > 0) {
      for (const sub of nested) {
        problems.push(`stacks[${index}]: ${JSON.stringify(`${entry.path}/${sub}`)} holds a kustomization, which kubectl -R would read as a manifest. Declare it as a stack of its own, or keep it out of ${shown}.`);
      }
      return;
    }
    if (!files.some(isKustomization) && manifestFiles(dir, recursive).length === 0) {
      problems.push(`stacks[${index}]: ${shown} holds no manifests (*.yaml, *.yml, *.json) and no kustomization. ${NAMES}`);
      return;
    }
    const options = { tool: KUBECTL, ...parsed.options };
    stacks.push({
      path: entry.path,
      ...entry.name === undefined ? {} : { name: entry.name },
      options: { ...options }
    });
  });
  if (optionProblems.length === 0 && problems.length > 0)
    throw new DiscoveryError(problems);
  return { stacks, optionProblems };
}

// src/adapters/opentofu/discover.ts
import { readdirSync as readdirSync2, statSync as statSync2 } from "node:fs";
import { isAbsolute as isAbsolute2, join as join4, normalize as normalize2, relative as relative2, sep as sep2 } from "node:path";

// src/adapters/opentofu/options.ts
var text4 = string2().min(1);
var TERRAGRUNT = "terragrunt";
var CDKTF = "cdktf";
var WRAPPERS = [TERRAGRUNT, CDKTF];
var openTofuOptionsSchema = strictObject({
  workspace: text4.describe("The workspace of the stack, selected with TF_WORKSPACE for every command. Without it, the one the environment selects, which is default.").exactOptional(),
  varFiles: array(text4).describe("Var files, relative to the directory of the stack, passed with -var-file in this order to every plan. Not with a wrapper.").default([]),
  wrapper: _enum(WRAPPERS).describe("What stands in front of the tool. terragrunt: path is one Terragrunt unit, and terragrunt runs the tool there. cdktf: path is a CDK for Terraform app, cdktf synth writes its stacks, and name picks the one this entry deploys.").exactOptional()
});
var OPENTOFU = "opentofu";
var TERRAFORM = "terraform";
var TERRAFORM_FAMILY = [OPENTOFU, TERRAFORM];
function isFamilyTool(tool) {
  return TERRAFORM_FAMILY.includes(tool);
}
function isOpenTofuOptions(options) {
  return isFamilyTool(options.tool);
}
function parseOpenTofuOptions(raw, index, tool = OPENTOFU) {
  const parsed = openTofuOptionsSchema.safeParse(raw ?? {});
  if (parsed.success)
    return { ok: true, options: parsed.data };
  const at = `stacks[${index}].options`;
  const known = Object.keys(openTofuOptionsSchema.shape).join(", ");
  const issues = [...parsed.error.issues].sort((a, b) => Number(b.code === "unrecognized_keys") - Number(a.code === "unrecognized_keys"));
  const problems = issues.flatMap((issue) => {
    if (issue.code === "unrecognized_keys") {
      return issue.keys.map((key) => `${at}: unknown option ${JSON.stringify(key)}. Known options for ${tool}: ${known}.`);
    }
    const where = `${at}${issue.path.map((part) => typeof part === "number" ? `[${part}]` : `.${String(part)}`).join("")}`;
    if (issue.code === "too_small")
      return [`${where}: must not be empty.`];
    if (issue.path.length === 1 && issue.path[0] === "varFiles") {
      return [`${where}: expected a list of file names.`];
    }
    if (issue.path.length === 1 && issue.path[0] === "wrapper") {
      return [`${where}: expected one of ${WRAPPERS.map((w) => JSON.stringify(w)).join(" or ")}.`];
    }
    return [`${where}: expected text.`];
  });
  return { ok: false, problems };
}

// src/adapters/opentofu/discover.ts
var MODULE_FILES = {
  opentofu: {
    pattern: /\.(tf|tofu|tf\.json|tofu\.json)$/,
    shown: "*.tf, *.tofu, *.tf.json, *.tofu.json",
    word: "OpenTofu"
  },
  terraform: { pattern: /\.(tf|tf\.json)$/, shown: "*.tf, *.tf.json", word: "Terraform" }
};
var TERRAGRUNT_FILES = ["terragrunt.hcl", "terragrunt.hcl.json"];
var CDKTF_FILE = "cdktf.json";
var CDKTF_STACK_NAME = /^[A-Za-z0-9_-]+$/;
function discoverOpenTofu(root, config) {
  const stacks = [];
  const optionProblems = [];
  const problems = [];
  const declaredBy = new Map;
  config.stacks.forEach((entry, index) => {
    if (!isFamilyTool(entry.tool))
      return;
    const tool = entry.tool;
    const parsed = parseOpenTofuOptions(entry.options, index, tool);
    if (!parsed.ok) {
      optionProblems.push(...parsed.problems);
      return;
    }
    const { wrapper } = parsed.options;
    const before = optionProblems.length;
    if (wrapper !== undefined && parsed.options.varFiles.length > 0) {
      optionProblems.push(wrapper === TERRAGRUNT ? `stacks[${index}].options.varFiles: a Terragrunt unit passes its var files in its own terragrunt.hcl (extra_arguments), so the entry takes none.` : `stacks[${index}].options.varFiles: a CDK for Terraform app sets its variables in code, so the entry takes none.`);
    }
    if (wrapper === CDKTF && entry.name === undefined) {
      optionProblems.push(`stacks[${index}].name: an entry with wrapper: cdktf names the CDK for Terraform stack it deploys, as the app calls it.`);
    }
    if (wrapper === CDKTF && entry.name !== undefined && !CDKTF_STACK_NAME.test(entry.name)) {
      optionProblems.push(`stacks[${index}].name: ${JSON.stringify(entry.name)} is not a CDK for Terraform stack name: letters, digits, "-" and "_" only.`);
    }
    const kind = `tool: ${tool}${wrapper === undefined ? "" : ` and wrapper: ${wrapper}`}`;
    const earlier = declaredBy.get(entry.path);
    if (earlier === undefined) {
      declaredBy.set(entry.path, { index, kind });
    } else if (earlier.kind !== kind) {
      optionProblems.push(`stacks[${index}]: ${JSON.stringify(entry.path)} is declared with ${earlier.kind} by stacks[${earlier.index}]. The stacks of one directory share its init, so they name the same tool and wrapper.`);
    }
    if (optionProblems.length > before)
      return;
    const dir = join4(root, entry.path);
    const shown = JSON.stringify(entry.path);
    const files = filesIn2(dir);
    const names = wrapper === TERRAGRUNT ? "the directory of one Terragrunt unit" : wrapper === CDKTF ? "the directory of a CDK for Terraform app" : "the directory of a root module";
    const about = wrapper === undefined ? `An entry with tool: ${tool}` : `An entry with wrapper: ${wrapper}`;
    if (files === undefined) {
      problems.push(`stacks[${index}]: ${shown} is not a directory of the repo. ${about} names ${names}.`);
      return;
    }
    if (wrapper === TERRAGRUNT && !files.some((file) => TERRAGRUNT_FILES.includes(file))) {
      problems.push(`stacks[${index}]: ${shown} holds no terragrunt.hcl or terragrunt.hcl.json. ${about} names ${names}.`);
      return;
    }
    if (wrapper === CDKTF && !files.includes(CDKTF_FILE)) {
      problems.push(`stacks[${index}]: ${shown} holds no ${CDKTF_FILE}. ${about} names ${names}.`);
      return;
    }
    const module = MODULE_FILES[tool];
    if (wrapper === undefined && !files.some((file) => module.pattern.test(file))) {
      problems.push(`stacks[${index}]: ${shown} holds no ${module.word} files (${module.shown}). ${about} names ${names}.`);
      return;
    }
    const varProblems = problems.length;
    parsed.options.varFiles.forEach((file, at) => {
      const where = `stacks[${index}].options.varFiles[${at}]: ${JSON.stringify(file)}`;
      if (isAbsolute2(file)) {
        problems.push(`${where} must be relative to the directory of the stack.`);
        return;
      }
      const fromRoot = relative2(root, normalize2(join4(dir, file)));
      if (fromRoot === ".." || fromRoot.startsWith(`..${sep2}`) || isAbsolute2(fromRoot)) {
        problems.push(`${where} must stay inside the repo.`);
        return;
      }
      if (!isFile2(join4(root, fromRoot)))
        problems.push(`${where} is not a file in ${shown}.`);
    });
    if (problems.length > varProblems)
      return;
    const options = { tool, ...parsed.options };
    stacks.push({
      path: entry.path,
      ...entry.name === undefined ? {} : { name: entry.name },
      options: { ...options }
    });
  });
  if (optionProblems.length === 0 && problems.length > 0)
    throw new DiscoveryError(problems);
  return { stacks, optionProblems };
}
function filesIn2(dir) {
  try {
    return readdirSync2(dir, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch {
    return;
  }
}
function isFile2(path) {
  try {
    return statSync2(path).isFile();
  } catch {
    return false;
  }
}

// src/adapters/opentofu/root-modules.ts
import { readdirSync as readdirSync3, readFileSync as readFileSync3 } from "node:fs";
import { join as join5, posix } from "node:path";

// src/adapters/opentofu/hcl.ts
function readHcl(text) {
  const { tokens, code } = tokenize(text);
  const reader = { tokens, at: 0 };
  const top = body(reader, false);
  return { blocks: top.blocks, attributes: top.attributes, code };
}
function body(reader, inner) {
  const block = { type: "", labels: [], strings: {}, attributes: [], blocks: [] };
  items(reader, block, inner);
  return block;
}
function items(reader, into, inner) {
  const { tokens } = reader;
  while (reader.at < tokens.length) {
    const token = tokens[reader.at];
    if (token === undefined)
      return;
    if (token.kind === "newline") {
      reader.at++;
      continue;
    }
    if (token.kind === "close") {
      if (inner)
        reader.at++;
      else {
        reader.at++;
        continue;
      }
      return;
    }
    if (token.kind !== "word") {
      skipLine(reader);
      continue;
    }
    reader.at++;
    const next = tokens[reader.at];
    if (next?.kind === "equals") {
      reader.at++;
      into.attributes.push(token.text);
      const value = expression(reader);
      if (value !== undefined)
        into.strings[token.text] = value;
      continue;
    }
    const labels = [];
    while (reader.at < tokens.length) {
      const label = tokens[reader.at];
      if (label?.kind === "string" && label.literal !== undefined)
        labels.push(label.literal);
      else if (label?.kind === "word")
        labels.push(label.text);
      else
        break;
      reader.at++;
    }
    if (tokens[reader.at]?.kind !== "open") {
      skipLine(reader);
      continue;
    }
    reader.at++;
    const child = { type: token.text, labels, strings: {}, attributes: [], blocks: [] };
    items(reader, child, true);
    into.blocks.push(child);
  }
}
function expression(reader) {
  const { tokens } = reader;
  let depth = 0;
  const seen = [];
  while (reader.at < tokens.length) {
    const token = tokens[reader.at];
    if (token === undefined)
      break;
    if (depth === 0 && (token.kind === "newline" || token.kind === "close"))
      break;
    if (token.kind === "open" || token.kind === "bracket" && "([".includes(token.text))
      depth++;
    if (token.kind === "close" || token.kind === "bracket" && ")]".includes(token.text))
      depth--;
    seen.push(token);
    reader.at++;
  }
  const [only] = seen;
  return seen.length === 1 && only?.kind === "string" ? only.literal : undefined;
}
function skipLine(reader) {
  expression(reader);
}
function tokenize(text) {
  const tokens = [];
  let code = "";
  let at = 0;
  while (at < text.length) {
    const char = text[at] ?? "";
    const rest = text.slice(at, at + 2);
    if (char === "#" || rest === "//") {
      while (at < text.length && text[at] !== `
`)
        at++;
      continue;
    }
    if (rest === "/*") {
      const end = text.indexOf("*/", at + 2);
      at = end < 0 ? text.length : end + 2;
      code += " ";
      continue;
    }
    if (char === `
`) {
      tokens.push({ kind: "newline" });
      code += char;
      at++;
      continue;
    }
    if (char === '"') {
      const end = stringEnd(text, at);
      const raw = text.slice(at + 1, end - 1);
      tokens.push({ kind: "string", literal: literalOf(raw) });
      code += text.slice(at, end);
      at = end;
      continue;
    }
    const heredoc = /^<<-?([A-Za-z_][A-Za-z0-9_]*)[ \t]*\n/.exec(text.slice(at));
    if (heredoc !== null) {
      const marker = heredoc[1] ?? "";
      let end = at + heredoc[0].length;
      while (end < text.length) {
        const lineEnd = text.indexOf(`
`, end);
        const line = text.slice(end, lineEnd < 0 ? text.length : lineEnd);
        end = lineEnd < 0 ? text.length : lineEnd + 1;
        if (line.trim() === marker)
          break;
      }
      tokens.push({ kind: "string", literal: undefined });
      code += text.slice(at, end);
      tokens.push({ kind: "newline" });
      at = end;
      continue;
    }
    const word = /^[A-Za-z_][A-Za-z0-9_.-]*/.exec(text.slice(at));
    if (word !== null) {
      tokens.push({ kind: "word", text: word[0] });
      code += word[0];
      at += word[0].length;
      continue;
    }
    if (char === "{")
      tokens.push({ kind: "open" });
    else if (char === "}")
      tokens.push({ kind: "close" });
    else if (char === "=" && text[at + 1] !== "=" && text[at + 1] !== ">")
      tokens.push({ kind: "equals" });
    else if ("[]()".includes(char))
      tokens.push({ kind: "bracket", text: char });
    else if (!/\s/.test(char))
      tokens.push({ kind: "other" });
    if (char === "=" && (text[at + 1] === "=" || text[at + 1] === ">")) {
      code += text.slice(at, at + 2);
      at += 2;
      continue;
    }
    code += char;
    at++;
  }
  return { tokens, code };
}
function stringEnd(text, start) {
  let at = start + 1;
  while (at < text.length) {
    const char = text[at];
    if (char === "\\") {
      at += 2;
      continue;
    }
    if (char === '"')
      return at + 1;
    if (char === `
`)
      return at;
    if ((char === "$" || char === "%") && text[at + 1] === char && text[at + 2] === "{") {
      at += 3;
      continue;
    }
    if ((char === "$" || char === "%") && text[at + 1] === "{") {
      at = templateEnd(text, at + 2);
      continue;
    }
    at++;
  }
  return text.length;
}
function templateEnd(text, start) {
  let depth = 1;
  let at = start;
  while (at < text.length && depth > 0) {
    const char = text[at];
    if (char === '"') {
      at = stringEnd(text, at);
      continue;
    }
    if (char === "{")
      depth++;
    if (char === "}")
      depth--;
    at++;
  }
  return at;
}
function literalOf(raw) {
  if (/\$\{|%\{/.test(raw))
    return;
  if (/\\[^"\\]/.test(raw))
    return;
  return raw.replace(/\\(["\\])/g, "$1");
}

// src/adapters/opentofu/root-modules.ts
var ROOT_MODULES = "rootModules";
var MODULE_FILE = /\.(tf|tofu|tf\.json|tofu\.json)$/;
var TOFU_FILE = /\.tofu(\.json)?$/;
var LOCK_FILE = ".terraform.lock.hcl";
var TERRAGRUNT_FILE = /^terragrunt(\.stack)?\.hcl(\.json)?$/;
var AUTO_VAR_FILE = /^terraform\.tfvars(\.json)?$|\.auto\.tfvars(\.json)?$/;
var VAR_FILE = /\.tfvars(\.json)?$/;
var BACKEND_FILE = /\.tfbackend$/;
var READS_WORKSPACE = /\b(terraform|tofu)\.workspace\b/;
var SKIPPED = new Set(["node_modules", "cdktf.out"]);
var REGISTRIES = {
  "registry.opentofu.org": OPENTOFU,
  "registry.terraform.io": TERRAFORM
};
var TOOL_WORDS = { opentofu: "OpenTofu", terraform: "Terraform" };
function findRootModules(root, config) {
  return judge(root, config).flatMap(({ path, tool }) => tool === undefined ? [] : [{ path, options: { tool, varFiles: [] } }]);
}
function explainRootModules(root, config) {
  return judge(root, config).map(({ path, tool, declared, because }) => ({
    path,
    outcome: tool !== undefined ? "found" : declared ? "declared" : "left-out",
    ...tool === undefined ? {} : { stackId: path },
    because
  }));
}
function judge(root, config) {
  const repo = readRepo(root);
  const declared = new Map;
  config.stacks.forEach((entry, index) => {
    if (entry.tool !== undefined && !declared.has(entry.path))
      declared.set(entry.path, index);
  });
  const namedBy = new Map;
  for (const directory of repo.directories) {
    for (const source of directory.sources) {
      const target = localSource(directory.path, source);
      if (target !== undefined && target !== directory.path && !namedBy.has(target)) {
        namedBy.set(target, directory.path);
      }
    }
  }
  const off = config.discovery[ROOT_MODULES] === false;
  return repo.directories.map((directory) => {
    const { path } = directory;
    const left = (because) => ({ path, because });
    const index = declared.get(path);
    if (index !== undefined) {
      return { path, declared: true, because: `declared by stacks[${index}], which it keeps` };
    }
    if (off)
      return left(`discovery.${ROOT_MODULES} is false in the config file`);
    if (repo.terragrunt !== undefined) {
      return left(`the repo uses Terragrunt (${repo.terragrunt}): its units are declared with wrapper: terragrunt, and the modules they run are not stacks`);
    }
    const user = namedBy.get(path);
    if (user !== undefined)
      return left(`${user} uses it as a module source`);
    if (path.split("/").includes("modules"))
      return left("it sits under a modules directory");
    const { state } = directory;
    if (state === undefined) {
      return left("no backend or cloud block: only a root module chooses where its state lives, and state left on the runner is lost");
    }
    if (directory.readsWorkspace !== undefined) {
      return left(`${directory.readsWorkspace} reads the workspace, so the root runs in workspaces its files do not name: declare one stack per workspace`);
    }
    if (state.tags) {
      return left(`the cloud block in ${state.file} picks its workspaces by tags: declare one stack per workspace`);
    }
    const chosen = [
      ...directory.chosenFiles,
      ...[...repo.varDirectories].filter(([under]) => posix.dirname(under) === path).flatMap(([under, files]) => files.map((file) => posix.relative(path, `${under}/${file}`)))
    ].sort(byCodeUnit);
    if (chosen.length > 0) {
      return left(`${listed2(chosen)} ${chosen.length === 1 ? "is a file" : "are files"} the tool loads only when told to: which one a stack takes is the repo's to say`);
    }
    const tools = [...new Set(directory.lockTools)];
    const tofuFiles = directory.files.some((file) => TOFU_FILE.test(file));
    if (tofuFiles && !tools.includes(OPENTOFU))
      tools.push(OPENTOFU);
    const [tool, ...others] = tools.sort();
    if (tool === undefined || others.length > 0) {
      return left(tool === undefined ? directory.hasLockFile ? "its lock file names no provider of the OpenTofu or the Terraform registry, and it has no .tofu files, so its files do not say which tool runs it" : "no lock file and no .tofu files, so its files do not say whether OpenTofu or Terraform runs it" : "its files point at both OpenTofu and Terraform, so they do not say which tool runs it");
    }
    const where = state.label === undefined ? state.kind : `${state.kind} "${state.label}"`;
    const which = tofuFiles && directory.lockTools.length === 0 ? ".tofu files, which only OpenTofu reads" : `a lock file of ${TOOL_WORDS[tool]} providers`;
    return { path, tool, because: `a ${where} block in ${state.file}, and ${which}` };
  });
}
function readRepo(root) {
  const repo = { directories: [], varDirectories: new Map };
  const walk = (relative) => {
    let entries;
    try {
      entries = readdirSync3(join5(root, relative), { withFileTypes: true });
    } catch {
      return;
    }
    const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort(byCodeUnit);
    const path = relative || ".";
    const terragrunt = files.find((file) => TERRAGRUNT_FILE.test(file));
    if (terragrunt !== undefined && repo.terragrunt === undefined) {
      repo.terragrunt = relative === "" ? terragrunt : `${relative}/${terragrunt}`;
    }
    const code = files.filter((file) => MODULE_FILE.test(file));
    const chosenFiles = files.filter((file) => VAR_FILE.test(file) && !AUTO_VAR_FILE.test(file) || BACKEND_FILE.test(file));
    if (code.length > 0) {
      repo.directories.push(readDirectory(root, path, files, code, chosenFiles));
    } else if (chosenFiles.length > 0) {
      repo.varDirectories.set(path, chosenFiles);
    }
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".") || SKIPPED.has(entry.name))
        continue;
      walk(relative === "" ? entry.name : `${relative}/${entry.name}`);
    }
  };
  walk("");
  repo.directories.sort((a, b) => byCodeUnit(a.path, b.path));
  return repo;
}
function readDirectory(root, path, files, code, chosenFiles) {
  const directory = {
    path,
    files: code,
    sources: [],
    lockTools: [],
    hasLockFile: files.includes(LOCK_FILE),
    chosenFiles
  };
  for (const file of code) {
    const text = read(join5(root, path, file));
    const parsed = file.endsWith(".json") ? readJson(text) : readNative(text);
    if (parsed.state !== undefined)
      directory.state ??= { ...parsed.state, file };
    if (parsed.readsWorkspace)
      directory.readsWorkspace ??= file;
    directory.sources.push(...parsed.sources);
  }
  if (directory.hasLockFile) {
    const blocks = readHcl(read(join5(root, path, LOCK_FILE))).blocks;
    for (const block of blocks.filter((one) => one.type === "provider")) {
      const tool = REGISTRIES[block.labels[0]?.split("/")[0] ?? ""];
      if (tool !== undefined)
        directory.lockTools.push(tool);
    }
  }
  return directory;
}
function readNative(text) {
  const { blocks, code } = readHcl(text);
  let state;
  for (const block of blocks.filter((one) => one.type === "terraform")) {
    for (const inner of block.blocks) {
      if (state !== undefined)
        break;
      if (inner.type === "backend") {
        state = { kind: "backend", ...labelOf(inner), tags: false };
      } else if (inner.type === "cloud") {
        const tags = inner.blocks.some((one) => one.type === "workspaces" && one.attributes.includes("tags"));
        state = { kind: "cloud", tags };
      }
    }
  }
  const sources = blocks.filter((block) => block.type === "module").flatMap((block) => block.strings.source === undefined ? [] : [block.strings.source]);
  return {
    ...state === undefined ? {} : { state },
    readsWorkspace: READS_WORKSPACE.test(code),
    sources
  };
}
function labelOf(block) {
  const [label] = block.labels;
  return label === undefined ? {} : { label };
}
function readJson(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { readsWorkspace: false, sources: [] };
  }
  let state;
  for (const terraform of objects(field(parsed, "terraform"))) {
    if (state !== undefined)
      break;
    const backend = objects(field(terraform, "backend"))[0];
    const cloud = objects(field(terraform, "cloud"))[0];
    if (backend !== undefined) {
      const [label] = Object.keys(backend);
      state = { kind: "backend", ...label === undefined ? {} : { label }, tags: false };
    } else if (cloud !== undefined) {
      const tags = objects(field(cloud, "workspaces")).some((one) => ("tags" in one));
      state = { kind: "cloud", tags };
    }
  }
  const sources = objects(field(parsed, "module")).flatMap((modules) => Object.values(modules).flatMap((module) => objects(module).flatMap((one) => typeof one.source === "string" ? [one.source] : [])));
  return {
    ...state === undefined ? {} : { state },
    readsWorkspace: READS_WORKSPACE.test(text),
    sources
  };
}
function field(value, name) {
  return isRecord(value) ? value[name] : undefined;
}
function objects(value) {
  if (Array.isArray(value))
    return value.filter(isRecord);
  return isRecord(value) ? [value] : [];
}
function localSource(from, source) {
  if (!source.startsWith("./") && !source.startsWith("../"))
    return;
  const joined = posix.normalize(posix.join(from, source));
  const target = joined.replace(/\/+$/, "") || ".";
  if (target === ".." || target.startsWith("../"))
    return;
  return target;
}
function listed2(files) {
  const shown = files.slice(0, 3).join(", ");
  return files.length > 3 ? `${shown} and ${files.length - 3} more` : shown;
}
function read(file) {
  try {
    return readFileSync3(file, "utf8");
  } catch {
    return "";
  }
}

// src/adapters/pulumi/discover.ts
import { readdir, readFile } from "node:fs/promises";
import { isAbsolute as isAbsolute3, join as join6, relative as relative3, sep as sep3 } from "node:path";
var PROJECT_FILE = "Pulumi";
var EXTENSIONS = [".json", ".yaml", ".yml"];
var SKIPPED2 = new Set([".git", "node_modules"]);
async function discover(root, config) {
  const phaseKeys = config === undefined ? [] : phaseKeysOf(config);
  const stacks = [];
  const problems = [];
  const walk = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });
    const extension = EXTENSIONS.find((ext) => fileNames(entries).includes(PROJECT_FILE + ext));
    if (extension !== undefined) {
      const projectFile = join6(dir, PROJECT_FILE + extension);
      try {
        const { stackDir, project } = await readProjectFile(root, projectFile);
        const files = stackDir === dir ? fileNames(entries) : await fileNamesIn(stackDir);
        const path = slashed(relative3(root, dir)) || ".";
        const read = keysOf(project, phaseKeys);
        for (const name of stackNames(files, extension)) {
          stacks.push({
            path,
            name,
            options: {},
            ...read === undefined ? {} : { phaseKeys: read }
          });
        }
      } catch (error) {
        if (!(error instanceof ProjectFileProblem))
          throw error;
        problems.push(`${slashed(relative3(root, projectFile))}: ${error.message}`);
      }
    }
    for (const entry of entries) {
      if (entry.isDirectory() && !SKIPPED2.has(entry.name))
        await walk(join6(dir, entry.name));
    }
  };
  await walk(root);
  if (problems.length > 0)
    throw new DiscoveryError(problems.sort(byCodeUnit));
  return stacks.sort((a, b) => byCodeUnit(a.path, b.path) || byCodeUnit(a.name ?? "", b.name ?? ""));
}

class ProjectFileProblem extends Error {
}
function keysOf(project, keys) {
  if (keys.length === 0 || !isMapping2(project))
    return;
  const config = isMapping2(project.config) ? project.config : {};
  const read = {};
  for (const key of keys) {
    const text = configText(config[key]) ?? project[key];
    if (typeof text === "string")
      read[key] = text;
  }
  return Object.keys(read).length === 0 ? undefined : read;
}
function configText(entry) {
  if (typeof entry === "string")
    return entry;
  if (!isMapping2(entry) || entry.secret === true)
    return;
  const text = entry.value ?? entry.default;
  return typeof text === "string" ? text : undefined;
}
function isMapping2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
async function readProjectFile(root, projectFile) {
  const dir = join6(projectFile, "..");
  const lineCounter = new $LineCounter;
  const document = $parseDocument(await readFile(projectFile, "utf8"), {
    lineCounter,
    prettyErrors: false,
    uniqueKeys: false
  });
  const broken = document.errors[0];
  if (broken !== undefined) {
    const { line, col } = lineCounter.linePos(broken.pos[0]);
    throw new ProjectFileProblem(`line ${line}, column ${col}: not valid YAML.`);
  }
  const project = document.toJS();
  if (typeof project !== "object" || project === null || !("stackConfigDir" in project))
    return { stackDir: dir, project };
  const named = project.stackConfigDir;
  if (typeof named !== "string") {
    throw new ProjectFileProblem("stackConfigDir must be text, the directory that holds the stack files.");
  }
  const stackDir = join6(dir, named);
  const fromRoot = relative3(root, stackDir);
  if (fromRoot === ".." || fromRoot.startsWith(`..${sep3}`) || isAbsolute3(fromRoot)) {
    throw new ProjectFileProblem(`stackConfigDir points outside the repo (${JSON.stringify(named)}). Sluiceway only reads files inside the repo.`);
  }
  return { stackDir, project };
}
function stackNames(files, extension) {
  const prefix = `${PROJECT_FILE}.`;
  return files.filter((file) => file.startsWith(prefix) && file.endsWith(extension)).map((file) => file.slice(prefix.length, -extension.length)).filter((name) => name !== "");
}
function fileNames(entries) {
  return entries.filter((entry) => !entry.isDirectory()).map((entry) => entry.name);
}
async function fileNamesIn(dir) {
  try {
    return fileNames(await readdir(dir, { withFileTypes: true }));
  } catch (error) {
    const code = error.code;
    if (code === "ENOENT" || code === "ENOTDIR")
      return [];
    throw error;
  }
}
function slashed(path) {
  return path.split(sep3).join("/");
}

// src/adapters/discover-all.ts
var TOOLS = [OPENTOFU, TERRAFORM, HELM, KUBECTL];
var DISCOVERY_SWITCHES = [ROOT_MODULES];
async function discoverAll(root, config) {
  const toolProblems = config.stacks.flatMap((entry, index) => {
    if (entry.tool === undefined)
      return [];
    if (!TOOLS.includes(entry.tool)) {
      return [
        `stacks[${index}].tool: unknown tool ${JSON.stringify(entry.tool)}. Known tools: ${TOOLS.join(", ")}.`
      ];
    }
    return [
      ...entry.dependsOn === DEPENDS_ON_AUTO ? [
        `stacks[${index}].dependsOn: ${DEPENDS_ON_AUTO} reads the stack references of a Pulumi program, and an ${entry.tool} stack has none. Name the stack ids instead.`
      ] : [],
      ...typeof entry.phase === "object" ? [
        `stacks[${index}].phase: from reads a key of a Pulumi project file, and an ${entry.tool} stack has none. Name the phase instead.`
      ] : [],
      ...entry.createInBackend !== undefined ? [
        `stacks[${index}].createInBackend: the scan creates a Pulumi stack the backend lacks, and an ${entry.tool} stack has no such stack: its first scan makes what it needs. Leave the key out.`
      ] : []
    ];
  });
  const switchProblems = Object.keys(config.discovery).filter((name) => !DISCOVERY_SWITCHES.includes(name)).map((name) => `discovery.${name}: unknown key. Known keys: ${DISCOVERY_SWITCHES.join(", ")}.`);
  const tofu = tryDiscover(() => discoverOpenTofu(root, config));
  const charts = tryDiscover(() => discoverHelm(root, config));
  const manifests = tryDiscover(() => discoverKubectl(root, config));
  const problems = [
    ...switchProblems,
    ...toolProblems,
    ...tofu.optionProblems,
    ...charts.optionProblems,
    ...manifests.optionProblems
  ];
  if (problems.length > 0)
    throw new ConfigError(problems.sort(byEntry));
  const errors = [tofu.error, charts.error, manifests.error].filter((error) => error !== undefined);
  const other = errors.find((error) => !(error instanceof DiscoveryError));
  if (other !== undefined)
    throw other;
  if (errors.length > 0) {
    throw new DiscoveryError(errors.flatMap((error) => error.problems).sort(byEntry));
  }
  const declared = [
    ...tofu.stacks,
    ...findRootModules(root, config),
    ...charts.stacks,
    ...manifests.stacks
  ];
  const discovered = await discover(root, config);
  if (declared.length === 0)
    return withIds(config, discovered);
  return withIds(config, [...discovered, ...declared].sort((a, b) => byCodeUnit(a.path, b.path) || byCodeUnit(a.name ?? "", b.name ?? "")));
}
function tryDiscover(discover) {
  try {
    return discover();
  } catch (error) {
    return { stacks: [], optionProblems: [], error };
  }
}
function byEntry(a, b) {
  const index = (text) => Number(/^stacks\[(\d+)\]/.exec(text)?.[1] ?? 0);
  return index(a) - index(b);
}

// src/core/config-file.ts
import { existsSync, readFileSync as readFileSync4 } from "node:fs";
import { join as join7 } from "node:path";
var CONFIG_FILE = "sluiceway.yaml";
var CONFIG_FILE_YML = "sluiceway.yml";
var CONFIG_FILES = [CONFIG_FILE, CONFIG_FILE_YML];
function configFileName(root) {
  const present = CONFIG_FILES.filter((name) => existsSync(join7(root, name)));
  if (present.length > 1) {
    throw new ConfigError([
      { kind: "two-config-files", files: [CONFIG_FILE, CONFIG_FILE_YML], path: [] }
    ]);
  }
  return present[0];
}
function loadConfig(root) {
  const name = configFileName(root);
  if (name === undefined)
    return parseConfig(undefined);
  try {
    return parseConfig(read2(join7(root, name)));
  } catch (error) {
    if (error instanceof ConfigError && name !== CONFIG_FILE) {
      throw new ConfigError(error.issues, name);
    }
    throw error;
  }
}
function hasConfigFile(root) {
  return configFileName(root) !== undefined;
}
function read2(file) {
  try {
    return readFileSync4(file, "utf8");
  } catch (error) {
    const code = error.code;
    if (code === "ENOENT")
      return;
    if (code === "EISDIR")
      throw new ConfigError([{ kind: "not-a-file", path: [] }]);
    throw error;
  }
}

// src/core/credentials.ts
import { readFileSync as readFileSync5 } from "node:fs";
import { resolve } from "node:path";
var WAYS = {
  aws: [
    { names: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"] },
    { names: ["AWS_PROFILE"] },
    { names: [], uses: "aws-actions/configure-aws-credentials" }
  ],
  google: [
    { names: ["GOOGLE_APPLICATION_CREDENTIALS"] },
    { names: ["GOOGLE_CREDENTIALS"] },
    { names: ["GOOGLE_OAUTH_ACCESS_TOKEN"] },
    { names: [], uses: "google-github-actions/auth" }
  ],
  azure: [
    { names: ["ARM_CLIENT_ID", "ARM_TENANT_ID", "ARM_SUBSCRIPTION_ID", "ARM_CLIENT_SECRET"] },
    { names: ["ARM_CLIENT_ID", "ARM_TENANT_ID", "ARM_SUBSCRIPTION_ID", "ARM_USE_OIDC"] },
    { names: [], uses: "azure/login" }
  ],
  kubernetes: [
    { names: ["KUBECONFIG"] },
    { names: [], runs: "update-kubeconfig" },
    { names: [], runs: "get-credentials" },
    { names: [], uses: "azure/aks-set-context" },
    { names: [], uses: "google-github-actions/get-gke-credentials" }
  ],
  cloudflare: [
    { names: ["CLOUDFLARE_API_TOKEN"] },
    { names: ["CLOUDFLARE_API_KEY", "CLOUDFLARE_EMAIL"] }
  ],
  digitalocean: [{ names: ["DIGITALOCEAN_TOKEN"] }],
  github: [{ names: ["GITHUB_TOKEN"] }],
  hcloud: [{ names: ["HCLOUD_TOKEN"] }],
  linode: [{ names: ["LINODE_TOKEN"] }],
  vault: [{ names: ["VAULT_ADDR", "VAULT_TOKEN"] }],
  vultr: [{ names: ["VULTR_API_KEY"] }]
};
function cloudWays(cloud) {
  return WAYS[cloud].map((way) => ({ ...way, names: [...way.names] }));
}
function regionWays(cloud) {
  if (cloud !== "aws")
    return;
  return [
    { names: ["AWS_REGION"] },
    { names: ["AWS_DEFAULT_REGION"] },
    { names: [], uses: "aws-actions/configure-aws-credentials" }
  ];
}
function wayWords(way) {
  if (way.names.length > 0)
    return way.names.join(" with ");
  if (way.uses !== undefined)
    return `a step that uses ${way.uses}`;
  return `a step that runs ${way.runs ?? ""}`;
}
var LOADERS = new Set([
  "hashicorp/vault-action",
  "dopplerhq/secrets-fetch-action",
  "aws-actions/aws-secretsmanager-get-secrets",
  "google-github-actions/get-secretmanager-secrets",
  "1password/load-secrets-action"
]);
var ENV_FILE = /(^|\/)(\.env(\.[^/]+)?|[^/]+\.env)$/;
var ENV_LINE = /^\s*(export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/;
function jobEnvironment(provides, root) {
  const names = new Map;
  for (const { name, where } of provides.names)
    if (!names.has(name))
      names.set(name, where);
  const uses = [];
  const runs = [];
  const opaque = [];
  for (const step of provides.steps) {
    if (!step.before)
      continue;
    let seen = step.secret === true;
    if (step.uses !== undefined) {
      uses.push(step.uses);
      if (LOADERS.has(step.uses))
        seen = true;
    }
    if (step.run !== undefined) {
      runs.push(step.run);
      if (step.run.includes("GITHUB_ENV"))
        seen = true;
      for (const file of envFilesNamed(step.run)) {
        const listed = envFileNames(root, file);
        if (listed === undefined) {
          seen = true;
          continue;
        }
        for (const name of listed)
          if (!names.has(name))
            names.set(name, `listed in ${file}`);
      }
    }
    if (seen && !opaque.includes(step.step))
      opaque.push(step.step);
  }
  return { names, uses, runs, opaque, unread: [] };
}
function stackEnvironment(job, envFile, root) {
  if (envFile === undefined)
    return job;
  const listed = envFileNames(root, envFile);
  if (listed === undefined)
    return { ...job, unread: [...job.unread, envFile] };
  const names = new Map(job.names);
  for (const name of listed) {
    if (!names.has(name))
      names.set(name, `listed in ${envFile}, the envFile of the stack`);
  }
  return { ...job, names };
}
function envFilesNamed(text) {
  const found = [];
  for (const token of text.split(/[\s=]+/)) {
    const path = token.replace(/^["']|["']$/g, "");
    if (/^[\w./-]+$/.test(path) && ENV_FILE.test(path) && !found.includes(path))
      found.push(path);
  }
  return found;
}
function envFileNames(root, file) {
  let text;
  try {
    text = readFileSync5(resolve(root, file), "utf8");
  } catch {
    return;
  }
  const names = [];
  for (const line of text.split(`
`)) {
    const name = ENV_LINE.exec(line)?.[2];
    if (name !== undefined && !names.includes(name))
      names.push(name);
  }
  return names;
}
function judgeNeeds(needs, job) {
  return needs.map((need) => {
    if (need.ways.length === 0)
      return { need, met: "unknown" };
    for (const way of need.ways) {
      const by = meets(way, job);
      if (by !== undefined)
        return { need, met: true, by };
    }
    return { need, met: false, maybe: [...job.opaque], unread: [...job.unread] };
  });
}
function meets(way, job) {
  if (way.names.length > 0) {
    const wheres = way.names.map((name) => job.names.get(name));
    if (wheres.some((where) => where === undefined))
      return;
    const where = [...new Set(wheres)].join(" and ");
    return `${wayWords(way)}, ${where}`;
  }
  if (way.uses !== undefined)
    return job.uses.includes(way.uses) ? wayWords(way) : undefined;
  if (way.runs !== undefined) {
    const word = way.runs;
    return job.runs.some((run) => run.includes(word)) ? wayWords(way) : undefined;
  }
  return;
}
function judgeJobs(stacks, workflows, root) {
  return workflows.flatMap(({ path, jobs }) => jobs.filter(({ runs }) => runs.includes("scan") || runs.includes("apply")).map(({ job, provides }) => {
    const environment = jobEnvironment(provides, root);
    return {
      path,
      job,
      judged: stacks.flatMap(({ stackId, needs, envFile }) => judgeNeeds(needs, stackEnvironment(environment, envFile, root)).map((one) => ({
        ...one,
        stackId
      })))
    };
  }));
}

// src/adapters/opentofu/credentials.ts
import { readdirSync as readdirSync4, readFileSync as readFileSync6 } from "node:fs";
import { join as join8, posix as posix2 } from "node:path";
var PROVIDERS = {
  aws: "aws",
  awscc: "aws",
  google: "google",
  "google-beta": "google",
  azurerm: "azure",
  azuread: "azure",
  azapi: "azure",
  kubernetes: "kubernetes",
  helm: "kubernetes",
  cloudflare: "cloudflare",
  digitalocean: "digitalocean",
  github: "github",
  hcloud: "hcloud",
  linode: "linode",
  vault: "vault",
  vultr: "vultr",
  random: "nothing",
  null: "nothing",
  local: "nothing",
  tls: "nothing",
  time: "nothing",
  archive: "nothing",
  external: "nothing",
  http: "nothing",
  terraform: "nothing",
  assert: "nothing"
};
var BACKENDS = {
  s3: "aws",
  gcs: "google",
  azurerm: "azure",
  kubernetes: "kubernetes",
  local: "nothing",
  remote: [{ names: ["TF_TOKEN_app_terraform_io"] }],
  pg: [{ names: ["PG_CONN_STR"] }],
  consul: [{ names: ["CONSUL_HTTP_TOKEN"] }]
};
var MODULE_FILE2 = /\.(tf|tofu)$/;
var LOCK_FILE2 = ".terraform.lock.hcl";
var AUTO_VAR_FILE2 = /^terraform\.tfvars(\.json)?$|\.auto\.tfvars(\.json)?$/;
async function credentialNeeds(root, stack) {
  const { wrapper, varFiles } = stack.options;
  if (wrapper === TERRAGRUNT)
    return terragruntNeeds(root, stack.path);
  if (wrapper === CDKTF)
    return cdktfNeeds(root, stack.path);
  const files = Array.isArray(varFiles) ? varFiles.filter((f) => typeof f === "string") : [];
  return rootModuleNeeds(root, stack.path, files);
}
function rootModuleNeeds(root, path, varFiles) {
  const directory = readDirectory2(root, path);
  const needs = [];
  const backend = backendNeed(directory);
  if (backend !== undefined)
    needs.push(backend);
  needs.push(...providerNeeds(directory));
  const set = new Set;
  const chosen = varFiles.map((file) => posix2.join(path, file));
  const auto = directory.files.filter((file) => AUTO_VAR_FILE2.test(posix2.basename(file)));
  for (const file of [...chosen, ...auto])
    for (const name of varNames(root, file))
      set.add(name);
  for (const { file, blocks } of directory.code) {
    for (const block of blocks) {
      if (block.type !== "variable" || block.attributes.includes("default"))
        continue;
      const [name] = block.labels;
      if (name === undefined || set.has(name))
        continue;
      needs.push({
        what: `the variable ${name}`,
        namedIn: file,
        ways: [{ names: [`TF_VAR_${name}`] }]
      });
    }
  }
  return needs;
}
function terragruntNeeds(root, path) {
  const file = ["terragrunt.hcl", "terragrunt.hcl.json"].map((name) => posix2.join(path, name)).find((name) => text5(join8(root, name)) !== "");
  if (file === undefined || file.endsWith(".json"))
    return [];
  const { blocks } = readHcl(text5(join8(root, file)));
  const needs = [];
  const remote = blocks.find((block) => block.type === "remote_state");
  const label = remote?.strings.backend;
  if (label !== undefined) {
    const known = BACKENDS[label];
    if (known !== "nothing") {
      needs.push({ what: `the ${label} remote state`, namedIn: file, ways: waysOf(known) });
    }
  }
  const source = blocks.find((block) => block.type === "terraform")?.strings.source;
  const module = source === undefined ? undefined : localSource2(path, source);
  if (module !== undefined)
    needs.push(...providerNeeds(readDirectory2(root, module)));
  return needs;
}
function cdktfNeeds(root, path) {
  const file = posix2.join(path, "cdktf.json");
  let parsed;
  try {
    parsed = JSON.parse(text5(join8(root, file)));
  } catch {
    return [];
  }
  const listed = typeof parsed === "object" && parsed !== null && "terraformProviders" in parsed ? parsed.terraformProviders : undefined;
  const needs = [
    { what: "the backend the app sets in code", namedIn: file, ways: [] }
  ];
  const named = new Map;
  for (const entry of Array.isArray(listed) ? listed : []) {
    const spec = typeof entry === "string" ? entry : typeof entry === "object" && entry !== null && typeof entry.name === "string" ? entry.name : undefined;
    if (spec === undefined)
      continue;
    const name = (spec.split("@")[0] ?? "").split("/").at(-1) ?? "";
    if (name !== "" && !named.has(name))
      named.set(name, file);
  }
  needs.push(...needsOf(named, new Set));
  return needs;
}
function readDirectory2(root, path) {
  let names;
  try {
    names = readdirSync4(join8(root, path)).sort(byCodeUnit);
  } catch {
    names = [];
  }
  const at = (name) => posix2.join(path, name);
  const parsed = (name) => ({
    file: at(name),
    blocks: readHcl(text5(join8(root, at(name)))).blocks
  });
  return {
    files: names.map(at),
    lock: names.includes(LOCK_FILE2) ? parsed(LOCK_FILE2) : undefined,
    code: names.filter((name) => MODULE_FILE2.test(name)).map(parsed)
  };
}
function providerNeeds(directory) {
  const named = new Map;
  const name = (provider, file) => {
    if (provider !== "" && !named.has(provider))
      named.set(provider, file);
  };
  if (directory.lock !== undefined) {
    for (const block of directory.lock.blocks.filter((one) => one.type === "provider")) {
      name(block.labels[0]?.split("/").at(-1) ?? "", directory.lock.file);
    }
  }
  for (const { file, blocks } of directory.code) {
    for (const block of blocks.filter((one) => one.type === "terraform")) {
      for (const inner of block.blocks.filter((one) => one.type === "required_providers")) {
        for (const provider of inner.attributes)
          name(provider, file);
      }
    }
  }
  const regionSet = new Set;
  for (const { file, blocks } of directory.code) {
    for (const block of blocks.filter((one) => one.type === "provider")) {
      const [label] = block.labels;
      if (label === undefined)
        continue;
      name(label, file);
      if (block.attributes.includes("region"))
        regionSet.add(label);
    }
  }
  return needsOf(named, regionSet);
}
function needsOf(named, regionSet) {
  const needs = [];
  for (const [provider, namedIn] of named) {
    const cloud = PROVIDERS[provider];
    if (cloud === "nothing")
      continue;
    needs.push({
      what: `the ${provider} provider`,
      namedIn,
      ways: cloud === undefined ? [] : cloudWays(cloud)
    });
    const region = cloud === undefined ? undefined : regionWays(cloud);
    if (region !== undefined && !regionSet.has(provider)) {
      needs.push({ what: `a region for the ${provider} provider`, namedIn, ways: region });
    }
  }
  return needs;
}
function backendNeed(directory) {
  for (const { file, blocks } of directory.code) {
    for (const block of blocks.filter((one) => one.type === "terraform")) {
      for (const inner of block.blocks) {
        if (inner.type === "backend") {
          const [label] = inner.labels;
          if (label === undefined)
            continue;
          const known = BACKENDS[label];
          if (known === "nothing")
            return;
          return { what: `the ${label} backend`, namedIn: file, ways: waysOf(known) };
        }
        if (inner.type === "cloud") {
          const host = inner.strings.hostname ?? "app.terraform.io";
          return {
            what: "the cloud block",
            namedIn: file,
            ways: [{ names: [`TF_TOKEN_${host.replaceAll(".", "_").replaceAll("-", "__")}`] }]
          };
        }
      }
    }
  }
  return;
}
function waysOf(known) {
  if (known === undefined || known === "nothing")
    return [];
  return typeof known === "string" ? cloudWays(known) : known.map((way) => ({ ...way }));
}
function varNames(root, file) {
  const content = text5(join8(root, file));
  if (file.endsWith(".json")) {
    try {
      const parsed = JSON.parse(content);
      return typeof parsed === "object" && parsed !== null ? Object.keys(parsed) : [];
    } catch {
      return [];
    }
  }
  return readHcl(content).attributes;
}
function localSource2(from, source) {
  if (/^[a-z+]+::|:\/\//i.test(source) || source.includes("//"))
    return;
  if (!source.startsWith("."))
    return;
  const target = posix2.normalize(posix2.join(from, source)).replace(/\/+$/, "") || ".";
  if (target === ".." || target.startsWith("../"))
    return;
  return target;
}
function text5(file) {
  try {
    return readFileSync6(file, "utf8");
  } catch {
    return "";
  }
}

// src/adapters/pulumi/credentials.ts
import { readdirSync as readdirSync5, readFileSync as readFileSync7, statSync as statSync3 } from "node:fs";
import { join as join9, posix as posix3, relative as relative4, sep as sep4 } from "node:path";
var EXTENSIONS2 = [".json", ".yaml", ".yml"];
var PACKAGES = {
  aws: "aws",
  "aws-native": "aws",
  gcp: "google",
  "google-native": "google",
  azure: "azure",
  "azure-native": "azure",
  azuread: "azure",
  kubernetes: "kubernetes",
  cloudflare: "cloudflare",
  digitalocean: "digitalocean",
  github: "github",
  hcloud: "hcloud",
  linode: "linode",
  vault: "vault",
  vultr: "vultr",
  random: "nothing",
  command: "nothing",
  local: "nothing",
  null: "nothing",
  time: "nothing",
  tls: "nothing",
  std: "nothing",
  archive: "nothing",
  external: "nothing",
  http: "nothing",
  pulumi: "nothing"
};
var BACKENDS2 = {
  s3: "aws",
  gs: "google",
  azblob: "azure",
  file: "nothing"
};
var SECRETS = {
  awskms: "aws",
  gcpkms: "google",
  azurekeyvault: "azure",
  hashivault: "vault"
};
var TOKEN = [{ names: ["PULUMI_ACCESS_TOKEN"] }];
var PASSPHRASE = [
  { names: ["PULUMI_CONFIG_PASSPHRASE"] },
  { names: ["PULUMI_CONFIG_PASSPHRASE_FILE"] }
];
async function credentialNeeds2(root, stack) {
  const projectDir = join9(root, stack.path);
  const extension = EXTENSIONS2.find((ext) => isFile3(join9(projectDir, `Pulumi${ext}`)));
  if (extension === undefined)
    return [];
  const projectPath = join9(projectDir, `Pulumi${extension}`);
  const project = read3(projectPath);
  if (!isRecord(project))
    return [];
  const projectFile = repoPath(root, projectPath);
  const needs = [];
  const url = isRecord(project.backend) ? project.backend.url : undefined;
  const scheme = typeof url === "string" ? schemeOf(url) : undefined;
  if (scheme === undefined) {
    needs.push({
      what: "the Pulumi backend",
      namedIn: projectFile,
      ways: [{ names: ["PULUMI_ACCESS_TOKEN"] }, { names: ["PULUMI_BACKEND_URL"] }]
    });
  } else if (scheme === "https" || scheme === "http") {
    needs.push({ what: "the Pulumi Cloud backend", namedIn: projectFile, ways: TOKEN });
  } else {
    const cloud = BACKENDS2[scheme];
    if (cloud !== "nothing") {
      needs.push({
        what: `the ${scheme} backend`,
        namedIn: projectFile,
        ways: cloud === undefined ? [] : cloudWays(cloud)
      });
    }
  }
  const stackDir = typeof project.stackConfigDir === "string" ? join9(projectDir, project.stackConfigDir) : projectDir;
  const stackPath = stack.name === undefined ? undefined : join9(stackDir, `Pulumi.${stack.name}${extension}`);
  const stackFile = stackPath === undefined ? undefined : read3(stackPath);
  const stackRepoPath = stackPath === undefined ? projectFile : repoPath(root, stackPath);
  if (isRecord(stackFile)) {
    const provider = typeof stackFile.secretsprovider === "string" ? schemeOf(stackFile.secretsprovider) : undefined;
    if ("encryptionsalt" in stackFile || provider === "passphrase") {
      needs.push({
        what: "the passphrase of its secrets",
        namedIn: stackRepoPath,
        ways: PASSPHRASE
      });
    }
    if (provider !== undefined && provider !== "passphrase") {
      const cloud = SECRETS[provider];
      needs.push({
        what: `the ${provider} secrets provider`,
        namedIn: stackRepoPath,
        ways: cloud === undefined ? [] : cloudWays(cloud)
      });
    }
  }
  const providers = new Map;
  const name = (provider, file) => {
    if (!providers.has(provider))
      providers.set(provider, file);
  };
  const runtime = runtimeName(project.runtime);
  if (runtime === "yaml") {
    for (const provider of yamlProviders(projectDir, projectPath, project))
      name(...provider);
  } else if (runtime === "nodejs") {
    for (const provider of nodeProviders(root, stack.path))
      name(...provider);
  } else if (runtime === "python") {
    for (const provider of pythonProviders(projectDir))
      name(...provider);
  } else if (runtime === "go") {
    for (const provider of goProviders(projectDir))
      name(...provider);
  } else if (runtime === "dotnet") {
    for (const provider of dotnetProviders(projectDir))
      name(...provider);
  }
  const configKeys = new Set;
  for (const [file, config] of [
    [projectPath, project.config],
    [stackPath, isRecord(stackFile) ? stackFile.config : undefined]
  ]) {
    if (file === undefined || !isRecord(config))
      continue;
    for (const key of Object.keys(config)) {
      configKeys.add(key);
      const namespace = key.split(":")[0] ?? "";
      if (key.includes(":") && namespace in PACKAGES)
        name(namespace, file);
    }
  }
  for (const [provider, file] of providers) {
    const cloud = PACKAGES[provider];
    if (cloud === "nothing")
      continue;
    const namedIn = repoPath(root, file);
    needs.push({
      what: `the ${provider} provider`,
      namedIn,
      ways: cloud === undefined ? [] : cloudWays(cloud)
    });
    const region = cloud === undefined ? undefined : regionWays(cloud);
    if (region !== undefined && !configKeys.has(`${provider}:region`)) {
      needs.push({ what: `a region for the ${provider} provider`, namedIn, ways: region });
    }
  }
  return needs;
}
function yamlProviders(projectDir, projectPath, project) {
  const programDir = isRecord(project) && typeof project.main === "string" ? join9(projectDir, project.main) : projectDir;
  const programs = programDir === projectDir ? [projectPath, join9(projectDir, "Main.yaml")] : [join9(programDir, "Main.yaml"), join9(programDir, "Pulumi.yaml")];
  const found = [];
  for (const file of programs.filter(isFile3)) {
    const program = file === projectPath ? project : read3(file);
    walk2(program, (key, value) => {
      if (key !== "type" || typeof value !== "string")
        return;
      const [first, second, third] = value.split(":");
      const provider = first === "pulumi" && second === "providers" ? third : first;
      if (provider !== undefined && provider !== "")
        found.push([provider, file]);
    });
  }
  return found;
}
function nodeProviders(root, path) {
  for (const directory of ancestors(path)) {
    const file = join9(root, directory, "package.json");
    if (!isFile3(file))
      continue;
    const manifest = readJson2(file);
    if (!isRecord(manifest))
      return [];
    return [manifest.dependencies, manifest.devDependencies].flatMap((block) => isRecord(block) ? Object.keys(block).flatMap((key) => key.startsWith("@pulumi/") ? [[key.slice("@pulumi/".length), file]] : []) : []);
  }
  return [];
}
var PYTHON_PACKAGE = /\bpulumi[-_]([a-z0-9-]+)/gi;
function pythonProviders(projectDir) {
  return ["requirements.txt", "pyproject.toml"].flatMap((name) => {
    const file = join9(projectDir, name);
    if (!isFile3(file))
      return [];
    return [...text6(file).matchAll(PYTHON_PACKAGE)].map((match) => [
      (match[1] ?? "").toLowerCase().replaceAll("_", "-"),
      file
    ]);
  });
}
var GO_PACKAGE = /github\.com\/pulumi\/pulumi-([a-z0-9-]+?)(?:-sdk)?\/(?:sdk|v\d+)/g;
function goProviders(projectDir) {
  const file = join9(projectDir, "go.mod");
  if (!isFile3(file))
    return [];
  return [...text6(file).matchAll(GO_PACKAGE)].map((match) => [match[1] ?? "", file]);
}
var DOTNET_PACKAGE = /Include="Pulumi\.([A-Za-z0-9]+)"/g;
function dotnetProviders(projectDir) {
  let names;
  try {
    names = readdirSync5(projectDir).filter((name) => /\.(cs|fs|vb)proj$/.test(name));
  } catch {
    return [];
  }
  return names.sort().flatMap((name) => {
    const file = join9(projectDir, name);
    return [...text6(file).matchAll(DOTNET_PACKAGE)].map((match) => [kebab(match[1] ?? ""), file]);
  });
}
function kebab(name) {
  return name.replace(/(?<=[a-z0-9])(?=[A-Z])/g, "-").toLowerCase();
}
function runtimeName(runtime) {
  return isRecord(runtime) ? runtime.name : runtime;
}
function schemeOf(url) {
  const colon = url.indexOf("://");
  return (colon === -1 ? url : url.slice(0, colon)).toLowerCase();
}
function ancestors(path) {
  const found = [path];
  let current = path;
  while (current !== ".") {
    current = posix3.dirname(current);
    found.push(current);
  }
  return found;
}
function walk2(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value)
      walk2(item, visit);
  } else if (isRecord(value)) {
    for (const [key, inner] of Object.entries(value)) {
      visit(key, inner);
      walk2(inner, visit);
    }
  }
}
function read3(path) {
  try {
    return $parse(readFileSync7(path, "utf8"), { uniqueKeys: false });
  } catch {
    return;
  }
}
function readJson2(path) {
  try {
    return JSON.parse(readFileSync7(path, "utf8"));
  } catch {
    return;
  }
}
function text6(path) {
  try {
    return readFileSync7(path, "utf8");
  } catch {
    return "";
  }
}
function isFile3(path) {
  try {
    return statSync3(path).isFile();
  } catch {
    return false;
  }
}
function repoPath(root, path) {
  return relative4(root, path).split(sep4).join("/");
}

// src/adapters/credentials.ts
async function credentialNeeds3(root, stack) {
  if (isHelmOptions(stack.options) || isKubectlOptions(stack.options)) {
    return [
      {
        what: "the cluster",
        namedIn: configFileName(root) ?? "sluiceway.yaml",
        ways: cloudWays("kubernetes")
      }
    ];
  }
  if (isOpenTofuOptions(stack.options))
    return credentialNeeds(root, stack);
  return credentialNeeds2(root, stack);
}

// src/adapters/helm/file-references.ts
import { join as join10, normalize as normalize3 } from "node:path";
async function readsFiles(_root, stack) {
  const options = stack.options;
  const namedIn = "sluiceway.yaml";
  const chart = options.chartDir === undefined || options.chartDir === "." ? [] : [{ path: options.chartDir, kind: "directory", namedIn }];
  const values = options.valuesFiles.map((file) => ({
    path: normalize3(join10(stack.path, file)).split("\\").join("/"),
    kind: "file",
    namedIn
  }));
  return [...chart, ...values];
}

// src/adapters/pulumi/file-references.ts
import { readFileSync as readFileSync8, statSync as statSync4 } from "node:fs";
import { isAbsolute as isAbsolute4, join as join11, normalize as normalize4, relative as relative5, sep as sep5 } from "node:path";
var EXTENSIONS3 = [".json", ".yaml", ".yml"];
var PROGRAM_FUNCTIONS = {
  "fn::readFile": "file",
  "fn::fileAsset": "file",
  "fn::fileArchive": "either"
};
async function readsFiles2(root, stack) {
  const found = new Map;
  const projectDir = join11(root, stack.path);
  const extension = EXTENSIONS3.find((ext) => isFile4(join11(projectDir, `Pulumi${ext}`)));
  if (extension === undefined)
    return [];
  const projectPath = join11(projectDir, `Pulumi${extension}`);
  const project = read4(projectPath);
  if (!isRecord(project))
    return [];
  const keep = (path, from, namedIn, want) => {
    if (isAbsolute4(path) || path.includes("${"))
      return;
    const full = normalize4(join11(from, path));
    const fromRoot = relative5(root, full);
    if (fromRoot === "" || fromRoot === ".." || fromRoot.startsWith(`..${sep5}`) || isAbsolute4(fromRoot)) {
      return;
    }
    const kind = kindOf(full);
    if (kind === undefined)
      return;
    if (want === "file" && kind !== "file")
      return;
    if (want === "directory" && kind !== "directory")
      return;
    const slashed = fromRoot.split(sep5).join("/");
    found.set(`${slashed}
${kind}`, { path: slashed, kind, namedIn: repoPath2(root, namedIn) });
  };
  if (runtimeName2(project.runtime) === "yaml") {
    const programDir = typeof project.main === "string" ? join11(projectDir, project.main) : projectDir;
    const programs = programDir === projectDir ? [projectPath, join11(projectDir, "Main.yaml")] : [join11(programDir, "Main.yaml"), join11(programDir, "Pulumi.yaml")];
    for (const file of programs.filter(isFile4)) {
      const program = file === projectPath ? project : read4(file);
      walk3(program, (key, value) => {
        const want = PROGRAM_FUNCTIONS[key];
        if (want === undefined || typeof value !== "string")
          return;
        keep(value.replaceAll("${pulumi.cwd}", "."), programDir, file, want);
      });
    }
  }
  const pathLike = (value) => value.includes("/") || value.startsWith(".");
  if (isRecord(project.config)) {
    for (const declared of Object.values(project.config)) {
      if (typeof declared === "string" && pathLike(declared)) {
        keep(declared, projectDir, projectPath, "any");
      }
      if (!isRecord(declared) || declared.secret === true)
        continue;
      for (const value of [declared.default, declared.value]) {
        if (typeof value === "string" && pathLike(value))
          keep(value, projectDir, projectPath, "any");
      }
    }
  }
  if (stack.name !== undefined) {
    const stackDir = typeof project.stackConfigDir === "string" ? join11(projectDir, project.stackConfigDir) : projectDir;
    const stackPath = join11(stackDir, `Pulumi.${stack.name}${extension}`);
    const stackFile = read4(stackPath);
    if (isRecord(stackFile) && isRecord(stackFile.config)) {
      plainStrings(stackFile.config, (value) => {
        if (pathLike(value))
          keep(value, projectDir, stackPath, "any");
      });
    }
  }
  return [...found.values()].sort((a, b) => byCodeUnit(a.path, b.path));
}
function runtimeName2(runtime) {
  return isRecord(runtime) ? runtime.name : runtime;
}
function walk3(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value)
      walk3(item, visit);
  } else if (isRecord(value)) {
    for (const [key, inner] of Object.entries(value)) {
      visit(key, inner);
      walk3(inner, visit);
    }
  }
}
function plainStrings(value, visit) {
  if (typeof value === "string")
    visit(value);
  else if (Array.isArray(value))
    for (const item of value)
      plainStrings(item, visit);
  else if (isRecord(value) && !("secure" in value)) {
    for (const inner of Object.values(value))
      plainStrings(inner, visit);
  }
}
function read4(path) {
  try {
    return $parse(readFileSync8(path, "utf8"), { uniqueKeys: false });
  } catch {
    return;
  }
}
function kindOf(path) {
  try {
    const stat = statSync4(path);
    return stat.isDirectory() ? "directory" : stat.isFile() ? "file" : undefined;
  } catch {
    return;
  }
}
function isFile4(path) {
  return kindOf(path) === "file";
}
function repoPath2(root, path) {
  return relative5(root, path).split(sep5).join("/");
}

// src/adapters/file-references.ts
async function readsFiles3(root, stack) {
  if (isHelmOptions(stack.options))
    return readsFiles(root, stack);
  if (isOpenTofuOptions(stack.options) || isKubectlOptions(stack.options))
    return [];
  return readsFiles2(root, stack);
}

// src/adapters/files-only.ts
var filesOnly = {
  discover: discoverAll,
  explainDiscovery: async (root, config) => explainRootModules(root, config),
  readsFiles: readsFiles3,
  credentialNeeds: credentialNeeds3
};

// src/core/scan-plan.ts
function unclaimedToPlace(files) {
  return files.filter((file) => !isConfigFile(file));
}
function isConfigFile(file) {
  return CONFIG_FILES.includes(file);
}

// src/core/check.ts
var SUGGESTIONS = ["docs/**"];
var SHARED_FILES = new Set([
  "package.json",
  "package-lock.json",
  "npm-shrinkwrap.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "bun.lock",
  "bun.lockb",
  "deno.json",
  "deno.lock",
  "go.mod",
  "go.sum",
  "go.work",
  "go.work.sum",
  "Cargo.toml",
  "Cargo.lock",
  "pyproject.toml",
  "poetry.lock",
  "uv.lock",
  "Pipfile",
  "Pipfile.lock",
  "requirements.txt",
  "Gemfile",
  "Gemfile.lock",
  "composer.json",
  "composer.lock",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "gradle.lockfile",
  "packages.lock.json",
  "Directory.Packages.props"
]);
function sharedFiles(files) {
  return files.filter((file) => SHARED_FILES.has(file.slice(file.lastIndexOf("/") + 1))).sort(byCodeUnit);
}
function checkSetup(config, found, files, references = new Map) {
  const stacks = applyConfig(config, found);
  const claimants = stacks.map(({ stack, inputs }) => ({
    id: stackId(stack),
    path: stack.path,
    inputs
  }));
  const claimed = claim2(claimants, files, config.scan.unrelated);
  const unclaimed = unclaimedToPlace(claimed.unclaimed);
  const configFile = claimed.unclaimed.find((file) => !unclaimed.includes(file));
  const reads = readsOf(claimants, files, new Set(claimed.unclaimed), references);
  return {
    stacks,
    ignore: config.ignore.map((entry) => ignoreReport(ignoreGlob(entry), found)),
    unclaimed: groups(unclaimed),
    suggested: suggestedUnrelated(unclaimed),
    shared: sharedFiles(unclaimed),
    ...configFile === undefined ? {} : { configFile },
    phases: phaseGroups(config.phases, new Map(stacks.flatMap((one) => one.phase === undefined ? [] : [[stackId(one.stack), one.phase]]))),
    reads,
    inputs: inputsEntries(stacks, reads)
  };
}
function readsOf(claimants, files, unclaimed, references) {
  return claimants.flatMap(({ id, path, inputs }) => {
    const matches = globMatcher(inputs);
    const claims = (file) => path === "." || file.startsWith(`${path}/`) || matches(file);
    const read = references.get(id) ?? [];
    return [...read].sort((a, b) => byCodeUnit(a.path, b.path)).flatMap((reference) => {
      const under = reference.kind === "file" ? [reference.path] : files.filter((file) => file.startsWith(`${reference.path}/`));
      const left = under.filter((file) => !claims(file));
      if (left.length === 0)
        return [];
      const missed = left.some((file) => !unclaimed.has(file));
      return [{ ...reference, stackId: id, missed }];
    });
  });
}
function globFor({ path, kind }) {
  return kind === "file" ? globOf(path) : `${globOf(path)}/**`;
}
function inputsEntries(stacks, reads) {
  const byStack = Map.groupBy(reads, (read) => read.stackId);
  const byPath = Map.groupBy(stacks, ({ stack }) => stack.path);
  return [...byPath].flatMap(([path, inPath]) => {
    const globs = inPath.map(({ stack }) => (byStack.get(stackId(stack)) ?? []).map(globFor).join(`
`));
    if (globs.every((one) => one === ""))
      return [];
    if (globs.every((one) => one === globs[0])) {
      return [{ path, globs: (globs[0] ?? "").split(`
`) }];
    }
    return inPath.flatMap(({ stack }, index) => {
      const own = globs[index] ?? "";
      if (own === "")
        return [];
      return [
        { path, ...stack.name === undefined ? {} : { name: stack.name }, globs: own.split(`
`) }
      ];
    });
  });
}
function suggestedUnrelated(unclaimed) {
  return SUGGESTIONS.filter((glob) => unclaimed.some(globMatcher([glob])));
}
function ignoreReport(glob, found) {
  const matches = globMatcher([glob]);
  const stacks = found.map(stackId).filter(matches);
  if (stacks.length > 0)
    return { glob, stacks };
  const better = `${glob}:*`;
  const works = globMatcher([better]);
  const hinted = found.filter((stack) => matches(stack.path)).map(stackId).filter(works);
  return hinted.length === 0 ? { glob, stacks } : { glob, stacks, hint: { glob: better, stacks: hinted } };
}
function groups(files) {
  const top = (file) => {
    const slash = file.indexOf("/");
    return slash === -1 ? "." : file.slice(0, slash);
  };
  const byDirectory = Map.groupBy([...files].sort(byCodeUnit), top);
  return [...byDirectory].sort(([a], [b]) => a === "." ? -1 : b === "." ? 1 : byCodeUnit(a, b)).map(([directory, grouped]) => ({ directory, files: grouped }));
}

// src/core/repo-files.ts
import { readdir as readdir2 } from "node:fs/promises";
import { join as join12 } from "node:path";
var SKIPPED3 = new Set([".git", "node_modules"]);
async function repoFiles(root) {
  const files = [];
  const walk = async (relative) => {
    const entries = await readdir2(join12(root, ...relative), { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === ".git")
        continue;
      if (entry.isDirectory()) {
        if (!SKIPPED3.has(entry.name))
          await walk([...relative, entry.name]);
      } else {
        files.push([...relative, entry.name].join("/"));
      }
    }
  };
  await walk([]);
  return files.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
}

// src/core/workflow-check.ts
import { readdirSync as readdirSync6, readFileSync as readFileSync9 } from "node:fs";
import { join as join13 } from "node:path";

// src/core/merge-scan.ts
var MERGE_SCAN_INPUT = "sluiceway-merged";

// src/core/auto-mode.ts
var MODES = ["auto", "scan", "resolve", "apply", "settle", "check", "init"];
function isMode(value) {
  return MODES.includes(value);
}
var STARTS = {
  push: ["scan"],
  schedule: ["resolve", "scan"],
  workflow_dispatch: ["resolve", "scan"],
  issues: ["resolve"],
  pull_request: ["check"],
  merge_group: ["check"]
};
function startedBy(event, config) {
  if (!Object.hasOwn(STARTS, event))
    return;
  const modes = STARTS[event] ?? [];
  return config.readOnly ? modes.filter((mode) => mode !== "resolve") : [...modes];
}
function autoModesOn(triggers, config) {
  const events = triggers.called ? [
    ...triggers.events,
    ...Object.entries(STARTS).filter(([, modes]) => modes.some((mode) => mode !== "check")).map(([event]) => event)
  ] : triggers.events;
  const runs = new Set(events.flatMap((event) => startedBy(event, config) ?? []));
  if (!events.includes("issues"))
    runs.delete("resolve");
  if (runs.has("resolve")) {
    runs.add("apply");
    runs.add("settle");
  }
  return MODES.filter((mode) => runs.has(mode));
}

// src/core/workflow-check.ts
var WORKFLOW_DIRECTORY = ".github/workflows";
function readWorkflowFiles(root) {
  let names;
  try {
    names = readdirSync6(join13(root, WORKFLOW_DIRECTORY), { withFileTypes: true }).filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name)).map((entry) => entry.name);
  } catch {
    return [];
  }
  return names.sort(byCodeUnit).map((name) => ({
    path: `${WORKFLOW_DIRECTORY}/${name}`,
    text: readFileSync9(join13(root, WORKFLOW_DIRECTORY, name), "utf8")
  }));
}
function tokenNeeds(mode, config) {
  switch (mode) {
    case "scan":
      return {
        contents: "read",
        issues: "write",
        deployments: "write",
        actions: "read",
        "pull-requests": "read"
      };
    case "resolve":
      return {
        contents: config.mergeAndDeploy.authors.length > 0 ? "write" : "read",
        issues: "write",
        deployments: "write",
        actions: "write",
        "pull-requests": "read"
      };
    case "apply":
      return {
        contents: "read",
        issues: "write",
        deployments: "write",
        "pull-requests": "read"
      };
    case "settle":
      return { contents: "read", issues: "read", deployments: "write", actions: "write" };
    case "auto":
      return {};
    case "check":
    case "init":
      return { contents: "read" };
  }
}
var SLUICEWAY_STEP = /^sluiceway\/sluiceway@(.+)$/i;
function refKind(ref) {
  if (/^v\d+$/.test(ref))
    return "moving";
  if (/^v\d+\.\d+\.\d+$/.test(ref))
    return "release";
  if (/^[0-9a-f]{40}$/.test(ref))
    return "commit";
  return "other";
}
function permissionsOf(value) {
  if (value === "read-all" || value === "write-all")
    return value;
  if (!isRecord(value))
    return;
  return Object.fromEntries(Object.entries(value).map(([key, level]) => [key, String(level)]));
}
function triggersOf(value) {
  if (typeof value === "string")
    return { [value]: null };
  if (Array.isArray(value))
    return Object.fromEntries(value.map((event) => [String(event), null]));
  return isRecord(value) ? value : {};
}
function environmentOf(value) {
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (!isRecord(value) || value.name === undefined || value.name === null)
    return;
  return String(value.name);
}
function concurrencyOf(value) {
  if (typeof value === "string" || typeof value === "number") {
    return { group: String(value), queue: "", cancels: false };
  }
  if (!isRecord(value) || value.group === undefined)
    return;
  const cancels = value["cancel-in-progress"];
  return {
    group: String(value.group),
    queue: value.queue === undefined ? "" : String(value.queue),
    cancels: cancels === true || cancels === "true"
  };
}
function parseWorkflow(text) {
  let document;
  try {
    document = $parse(text);
  } catch {
    return "unreadable";
  }
  if (!isRecord(document) || !isRecord(document.jobs))
    return;
  const jobs = {};
  for (const [name, job] of Object.entries(document.jobs)) {
    if (!isRecord(job))
      continue;
    jobs[name] = {
      permissions: permissionsOf(job.permissions),
      steps: Array.isArray(job.steps) ? job.steps : [],
      concurrency: concurrencyOf(job.concurrency),
      condition: job.if === undefined || job.if === null ? "" : String(job.if),
      needs: typeof job.needs === "string" ? [job.needs] : Array.isArray(job.needs) ? job.needs.map(String) : [],
      outputs: isRecord(job.outputs) ? Object.keys(job.outputs) : [],
      strategy: job.strategy === undefined ? "" : JSON.stringify(job.strategy),
      environment: environmentOf(job.environment),
      env: envNames(job.env)
    };
  }
  return {
    on: triggersOf(document.on),
    permissions: permissionsOf(document.permissions),
    jobs,
    env: envNames(document.env)
  };
}
function envNames(value) {
  return isRecord(value) ? Object.keys(value) : [];
}
function handedSecret(step) {
  return [step.with, step.env].some((block) => isRecord(block) && Object.values(block).some((value) => /secrets\./.test(String(value))));
}
function actionOf(uses) {
  return uses.trim().split("@")[0] ?? "";
}
function providesOf(steps, at, workflowEnv, jobEnv) {
  const own = steps[at];
  const stepEnv = isRecord(own) ? envNames(own.env) : [];
  const names = [
    ...workflowEnv.map((name) => ({ name, where: "env: on the workflow" })),
    ...jobEnv.map((name) => ({ name, where: "env: on the job" })),
    ...stepEnv.map((name) => ({ name, where: "env: on the step" }))
  ];
  const others = steps.flatMap((step, index) => {
    if (index === at || !isRecord(step))
      return [];
    const uses = typeof step.uses === "string" ? actionOf(step.uses) : undefined;
    const run = typeof step.run === "string" ? step.run : undefined;
    const title = typeof step.name === "string" && step.name.trim() !== "" ? step.name.trim() : uses ?? `step ${index + 1}`;
    return [
      {
        step: title,
        ...uses === undefined ? {} : { uses },
        ...run === undefined ? {} : { run },
        ...handedSecret(step) ? { secret: true } : {},
        before: index < at
      }
    ];
  });
  return { names, steps: others };
}
function sluicewayJob(job, parsed, workflowEnv, auto) {
  const { steps } = parsed;
  for (const [index, step] of steps.entries()) {
    if (!isRecord(step) || typeof step.uses !== "string")
      continue;
    const ref = SLUICEWAY_STEP.exec(step.uses.trim())?.[1];
    if (ref === undefined)
      continue;
    const written = isRecord(step.with) ? String(step.with.mode ?? "").trim() : "";
    const named = written === "" ? "auto" : written;
    const mode = isMode(named) ? named : undefined;
    const runs = mode === undefined ? [] : mode === "auto" ? auto : [mode];
    const provides = providesOf(steps, index, workflowEnv, parsed.env);
    const preview = isRecord(step.with) ? step.with["pull-request-preview"] : undefined;
    const previews = preview === true || String(preview ?? "").trim() === "true";
    return {
      job,
      mode,
      runs,
      ref,
      refKind: refKind(ref),
      named,
      provides,
      ...previews ? { previewsPullRequests: true } : {}
    };
  }
  return;
}
function autoRuns(on, config) {
  const events = Object.keys(on).filter((event) => event !== "issues" || listensToEdits(on.issues, true));
  return autoModesOn({ events, called: "workflow_call" in on }, { readOnly: config.dashboard.readOnly });
}
function needsAll(modes, config) {
  const all = {};
  for (const mode of modes) {
    for (const [scope, level] of Object.entries(tokenNeeds(mode, config))) {
      if (all[scope] !== "write")
        all[scope] = level;
    }
  }
  return all;
}
function missing(granted, wanted) {
  return Object.entries(wanted).filter(([scope, level]) => {
    if (granted === "write-all")
      return false;
    if (granted === "read-all")
      return level === "write";
    const has = granted?.[scope];
    return !(has === "write" || has === "read" && level === "read");
  }).map(([scope, level]) => `${scope}: ${level}`);
}
function has(granted, scope) {
  return granted === "write-all" || isRecord(granted) && granted[scope] === "write";
}
function checkWorkflows(files, config) {
  const report = { workflows: [], warnings: [], notes: [] };
  for (const { path, text } of files) {
    const parsed = parseWorkflow(text);
    if (parsed === "unreadable") {
      if (/sluiceway\/sluiceway@/i.test(text)) {
        report.warnings.push({ kind: "unreadable", path });
      }
      continue;
    }
    if (parsed === undefined)
      continue;
    checkOne(path, parsed, config, report);
  }
  return report;
}
function checkOne(path, workflow, config, report) {
  const auto = autoRuns(workflow.on, config);
  const found = Object.entries(workflow.jobs).flatMap(([name, job]) => {
    const step = sluicewayJob(name, job, workflow.env, auto);
    if (step === undefined)
      return [];
    if (job.environment !== undefined)
      step.environment = job.environment;
    return [{ step, permissions: job.permissions ?? workflow.permissions }];
  });
  if (found.length === 0)
    return;
  const { warnings, notes } = report;
  report.workflows.push({
    path,
    jobs: found.map(({
      step: { job, mode, runs, ref, refKind, environment, provides, previewsPullRequests }
    }) => ({
      job,
      mode,
      runs,
      ref,
      refKind,
      ...environment === undefined ? {} : { environment },
      provides,
      ...previewsPullRequests ? { previewsPullRequests } : {}
    }))
  });
  for (const { step } of found) {
    if (step.mode === undefined) {
      warnings.push({ kind: "unknown-mode", path, job: step.job, mode: step.named });
    }
    if (step.previewsPullRequests && "pull_request_target" in workflow.on) {
      warnings.push({ kind: "preview-on-target", path, job: step.job });
    }
    if (step.refKind === "other") {
      warnings.push({ kind: "unreleased-ref", path, job: step.job, ref: step.ref });
    }
  }
  const refs = [...new Set(found.map(({ step }) => step.ref))];
  if (refs.length > 1)
    warnings.push({ kind: "mixed-refs", path, refs });
  const called = "workflow_call" in workflow.on;
  if (called)
    notes.push({ kind: "called", path });
  const modes = new Set(found.flatMap(({ step }) => step.runs));
  const runs = (mode) => modes.has(mode);
  const deploys = [...modes].some((mode) => mode !== "check" && mode !== "init");
  const autoDeploys = found.some(({ step }) => step.mode === "auto" && step.runs.some((mode) => mode !== "check"));
  if (!called && deploys) {
    for (const trigger of ["pull_request", "pull_request_target", "merge_group"]) {
      if (!(trigger in workflow.on))
        continue;
      warnings.push(autoDeploys ? { kind: "forbidden-trigger", path, trigger, auto: true } : { kind: "forbidden-trigger", path, trigger });
    }
  }
  if (!called && runs("scan")) {
    for (const trigger of ["push", "schedule", "workflow_dispatch"]) {
      if (!(trigger in workflow.on))
        warnings.push({ kind: "missing-trigger", path, trigger });
    }
  }
  if (!called && runs("resolve") && !listensToEdits(workflow.on.issues, "issues" in workflow.on)) {
    warnings.push({ kind: "missing-trigger", path, trigger: "issues" });
  }
  if (runs("resolve") || runs("apply") || runs("settle")) {
    for (const mode of ["scan", "resolve", "apply", "settle"]) {
      if (!runs(mode))
        warnings.push({ kind: "missing-job", path, mode });
    }
  } else if (runs("scan") && !config.dashboard.readOnly) {
    warnings.push({ kind: "boxes-do-nothing", path });
  }
  checkJobs(path, workflow, found, config, warnings);
  if (called)
    return;
  for (const { step, permissions } of found) {
    if (step.mode === undefined)
      continue;
    const { job, mode } = step;
    const wanted = needsAll(step.runs, config);
    if (step.previewsPullRequests)
      wanted.checks = "write";
    if (permissions === undefined) {
      warnings.push({ kind: "no-permissions", path, job, mode, needs: missing({}, wanted) });
      continue;
    }
    const lacks = missing(permissions, wanted);
    if (lacks.length > 0)
      warnings.push({ kind: "missing-permissions", path, job, mode, missing: lacks });
    if (step.runs.includes("scan") && !has(permissions, "checks")) {
      notes.push({ kind: "no-preview-pages", path, job });
    }
  }
}
function checkJobs(path, workflow, found, config, warnings) {
  const jobOf = (name) => workflow.jobs[name];
  const withMode = (mode) => found.filter(({ step }) => step.mode === mode).map(({ step }) => step.job);
  for (const { step } of found) {
    const { job, mode } = step;
    const { concurrency, condition } = jobOf(job);
    if (mode === "auto" && step.runs.some((one) => one !== "check")) {
      if (concurrency === undefined) {
        warnings.push({ kind: "no-concurrency", path, job, mode });
      } else {
        if (concurrency.queue !== "max")
          warnings.push({ kind: "auto-no-queue", path, job });
        if (concurrency.cancels)
          warnings.push({ kind: "auto-cancels", path, job });
      }
    }
    if (mode === "scan" || mode === "resolve" || mode === "apply") {
      if (concurrency === undefined) {
        warnings.push({ kind: "no-concurrency", path, job, mode });
      } else if (mode === "apply") {
        if (!/\bmatrix\.stack\b/.test(concurrency.group)) {
          warnings.push({ kind: "apply-group-shared", path, job });
        }
        if (concurrency.queue !== "max")
          warnings.push({ kind: "apply-no-queue", path, job });
        if (concurrency.cancels)
          warnings.push({ kind: "apply-cancels", path, job });
      } else if (mode === "resolve") {
        if (concurrency.queue !== "max")
          warnings.push({ kind: "resolve-no-queue", path, job });
        if (concurrency.cancels)
          warnings.push({ kind: "resolve-cancels", path, job });
      }
    }
    if (mode === "apply" && !/!\s*cancelled\(\s*\)|\balways\(\s*\)/.test(condition)) {
      warnings.push({ kind: "no-status-check", path, job, mode });
    }
    if (mode === "settle" && !/(^|[^!\w])always\(\s*\)/.test(condition)) {
      warnings.push({ kind: "no-status-check", path, job, mode });
    }
  }
  const applies = withMode("apply");
  const resolves = withMode("resolve");
  for (const settle of withMode("settle")) {
    const { needs, condition } = jobOf(settle);
    for (const apply of applies) {
      if (!needs.includes(apply)) {
        warnings.push({ kind: "settle-skips-apply", path, job: settle, apply });
      }
    }
    const always = /^(\$\{\{)?\s*always\(\s*\)\s*(\}\})?$/.test(condition.trim());
    for (const resolve of resolves) {
      if (!needs.includes(resolve) || always)
        continue;
      if (!new RegExp(`\\bneeds\\.${resolve}\\.result\\b`).test(condition)) {
        warnings.push({ kind: "settle-skips-cancelled-resolve", path, job: settle, resolve });
      }
    }
  }
  const scans = withMode("scan");
  const fromScan = applies.flatMap((apply) => {
    const source = /needs\.([\w-]+)\.outputs\.matrix/.exec(jobOf(apply).strategy)?.[1];
    return source !== undefined && scans.includes(source) ? [{ apply, scan: source }] : [];
  });
  for (const { apply, scan } of fromScan) {
    if (!jobOf(scan).outputs.includes("matrix")) {
      warnings.push({ kind: "scan-no-matrix-output", path, job: apply, scan });
    }
  }
  const mergesAndDeploys = config.mergeAndDeploy.authors.length > 0;
  if (mergesAndDeploys && scans.length > 0 && withMode("resolve").length > 0) {
    if (fromScan.length === 0)
      warnings.push({ kind: "no-merged-apply", path });
  }
  const onMerge = config.stacks.some(({ deploy }) => deploy === "on-merge");
  if (onMerge && !mergesAndDeploys && scans.length > 0 && applies.length > 0) {
    if (fromScan.length === 0)
      warnings.push({ kind: "no-on-merge-apply", path });
  }
}
function listensToEdits(issues, present) {
  if (!present)
    return false;
  if (!isRecord(issues) || issues.types === undefined)
    return true;
  const types = issues.types;
  return Array.isArray(types) ? types.includes("edited") : types === "edited";
}

// src/core/failure-reason.ts
function previewFailureText(reason) {
  switch (reason.kind) {
    case "tool-error":
      return reason.exitCode === null ? "the tool exited with an error" : `the tool exited with an error (exit code ${reason.exitCode})`;
    case "stack-not-found":
      return "the stack does not exist in the backend";
    case "configuration-error":
      return "the tool found the configuration invalid or incomplete";
    case "authentication-error":
      return "the tool could not authenticate or is not authorized";
    case "resource-error":
      return "a resource operation failed in the tool";
    case "tool-timed-out":
      return "the tool gave up on a time limit of its own";
    case "timed-out":
      return `the preview timed out after ${reason.minutes} ${reason.minutes === 1 ? "minute" : "minutes"}`;
    case "unreadable-output":
      return "the tool's output could not be read";
    case "unknown-step":
      return "the tool reported a step Sluiceway does not know";
    case "output-too-large":
      return `the tool printed more than the ${reason.megabytes} MB Sluiceway holds`;
    case "internal-error":
      return "Sluiceway failed inside itself, which is a bug";
    case "env-file-not-loaded":
      return "the env file of the stack could not be loaded";
    case "stack-busy":
      return "another update holds the stack's lock";
    case "in-summary":
      return "the reason is in the summary of the run";
  }
}

// src/core/policy.ts
var result = object({ msg: string2() });
var entry = object({
  namespace: string2(),
  successes: number2().int().nonnegative().optional(),
  failures: array(result).optional(),
  warnings: array(result).optional()
});
var report = array(entry);

// src/render/time.ts
var formats2 = new Map;
function format2(timeZone) {
  let found = formats2.get(timeZone);
  if (found === undefined) {
    found = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    formats2.set(timeZone, found);
  }
  return found;
}
function isUtc2(timeZone) {
  return timeZone === undefined || timeZone === "UTC";
}
function wall2(at, timeZone) {
  if (isUtc2(timeZone)) {
    const iso = at.toISOString();
    return {
      year: at.getUTCFullYear(),
      day: iso.slice(5, 10),
      minute: iso.slice(11, 16),
      offset: 0
    };
  }
  const parts = {};
  for (const part of format2(timeZone).formatToParts(at)) {
    if (part.type !== "literal")
      parts[part.type] = Number(part.value);
  }
  const { year = 0, month = 1, day = 1, hour = 0, minute = 0, second = 0 } = parts;
  const shown = Date.UTC(year, month - 1, day, hour, minute, second);
  const offset = Math.round((shown - Math.floor(at.getTime() / 1000) * 1000) / 60000);
  const two = (value) => String(value).padStart(2, "0");
  return {
    year,
    day: `${two(month)}-${two(day)}`,
    minute: `${two(hour)}:${two(minute)}`,
    offset
  };
}
function fullDay(time) {
  return `${String(time.year).padStart(4, "0")}-${time.day}`;
}
function offsetName(offset) {
  if (offset === 0)
    return "UTC";
  const sign = offset > 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  return `UTC${sign}${hours}${minutes === 0 ? "" : `:${String(minutes).padStart(2, "0")}`}`;
}
function minuteAt(at, timeZone) {
  const time = wall2(at, timeZone);
  return `${fullDay(time)} ${time.minute} ${offsetName(time.offset)}`;
}

// src/render/log-text.ts
function oneLine(text) {
  return text.replace(/[\p{Cc}\p{Zl}\p{Zp}]/gu, " ");
}
function logGroupTitle(stackId) {
  return oneLine(stackId);
}

// src/render/check.ts
var VALID = "The setup is valid.";
var NO_CONFIG_FILE = "No sluiceway.yaml, so every setting is its default.";
var CANNOT_TELL = "A check reads files only, so it cannot say that a preview will work: a stack that does not exist in the backend, a missing credential or a registry the runner cannot reach shows only in a scan.";
var CANNOT_TELL_WITH_BACKEND = "A check cannot say that a preview will work: a missing credential for a provider or a registry the runner cannot reach shows only in a scan.";
var BACKEND_OFF = "With backend: true the check also asks the backend which stacks it holds, with the credentials of its job.";
var PREVIEWED_PULL_REQUEST = "With pull-request-preview: true the pull request preview above ran the tool for the stacks the pull request claims, and for no other stack.";
var BACKEND_TITLE = "Stacks in the backend";
var BACKEND_PASTE_TITLE = "Ready to paste into sluiceway.yaml, over ignore";
var NOT_IN_BACKEND_TITLE = "A stack is not in the backend";
var COULD_NOT_ASK_TITLE = "Could not ask the backend";
var ALL_IN_BACKEND = "Every stack the backend was asked about is in it.";
var BACKEND_PASTE_NOTE = "The block below keeps what ignore has and adds the stacks the backend does not hold. Leave out any stack you are about to create.";
function whereFilesBelong(shared, show = logGroupTitle) {
  const start = "A file that some stacks read belongs under the inputs of those stacks in sluiceway.yaml. A file that no program reads, such as docs, can be listed under scan.unrelated.";
  if (shared.length === 0) {
    return `${start} Keep lockfiles and package manifests off that list: a change to one should preview every stack.`;
  }
  const names = shared.slice(0, SHARED_NAMED).map(show);
  const rest = shared.length - names.length;
  const listed = rest > 0 ? `${names.join(", ")} and ${rest} more` : names.length === 1 ? names[0] ?? "" : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  const why = shared.length === 1 ? "it is a lockfile or a package manifest, and a change to it should preview every stack" : "they are lockfiles and package manifests, and a change to one should preview every stack";
  return `${start} Keep ${listed} off that list: ${why}.`;
}
var SHARED_NAMED = 5;
var PASTE_NOTE = "The block below keeps what scan.unrelated has and adds globs for the files that look like docs and tooling. Sluiceway does not decide this for you: leave out any glob that covers a file one of your programs reads.";
var READS_TITLE = "Files stacks read and do not claim";
var READS_PASTE_TITLE = "Ready to paste into sluiceway.yaml, under stacks";
var READ_WARNING_TITLE = "A stack reads a file it does not claim";
var READS_NOTE = "The stack's own files name these as read. The entries below add them to the stacks' inputs, and inputs of several entries add up, so they can go under stacks next to the entries you have. Sluiceway reads only what the files name plainly: a path a program builds at run time does not show here.";
var NEEDS_TITLE = "Credentials each stack needs";
var CREDENTIALS_NOTE = "What each stack's own files say its tool will want from the job environment, as names, and which of them nothing in the workflow appears to provide. A program can read any variable, and a step that writes to the environment is opaque to the check, so this is a reading of the files and never a guarantee. No value is read or shown.";
var WORKFLOW_WARNING_TITLE = "A workflow is missing something";
var NOTHING_MISSING = "Nothing is missing from the workflows.";
var NO_SCAN_WORKFLOW = "No workflow in .github/workflows runs a scan yet.";
var WORKFLOWS_AS_TEXT = "The check reads the workflow files as text. The repo's default token permissions, the rules of an environment and what GitHub itself validates live elsewhere and do not show here.";
var FILES_PER_DIRECTORY = 20;
function foundText(count) {
  return count === 0 ? "Found no stacks." : `Found ${plural(count, "stack")}.`;
}
function settingsText(configured, phases = []) {
  const { environment, tickers, inputs } = configured;
  const rule = typeof tickers === "string" ? tickers : tickers.join(", ");
  const claims = inputs.length === 0 ? "no inputs" : `inputs ${inputs.join(", ")}`;
  const phase = configured.phase === undefined ? "" : `, phase ${phaseWords(configured, " (read from ", ")")}`;
  const waits = dependsOnWords(configured, phases);
  const onMerge = configured.deploy === "on-merge" ? ", deploys on merge" : "";
  return `environment ${environment}, tickers ${rule}, ${claims}${phase}${waits === undefined ? "" : `, depends on ${waits}`}${onMerge}`;
}
function phaseWords({ phase, phaseFrom }, before, after) {
  return phaseFrom === undefined ? `${phase}` : `${phase}${before}${phaseFrom}${after}`;
}
function split(configured, phases) {
  return waitsByPhase({
    phases: phases.map(({ phase }) => phase),
    phaseOf: new Map(phases.flatMap(({ phase, stackIds }) => stackIds.map((id) => [id, phase]))),
    stackId: stackId(configured.stack),
    waitingOn: configured.dependsOn ?? []
  });
}
function dependsOnWords(configured, phases) {
  const { named, phases: through } = split(configured, phases);
  const parts = [
    ...named,
    ...through.map(({ phase, stackIds }) => `${stackIds.join(", ")} through the ${phase} phase`),
    ...configured.dependsOnAuto ? ["the stacks its stack references name, read at each preview (auto)"] : []
  ];
  return parts.length === 0 ? undefined : parts.join(", ");
}
function dependsOnCell(configured, phases) {
  const { named, phases: through } = split(configured, phases);
  const parts = [
    ...named,
    ...through.map(({ phase }) => `the ${phase} phase`),
    ...configured.dependsOnAuto ? ["auto: its stack references, read at each preview"] : []
  ];
  return parts.length === 0 ? "none" : parts.join(", ");
}
function phaseLines(phases) {
  return phases.map(({ phase, stackIds }, index) => {
    const earlier = phases.slice(0, index).map((one) => one.phase);
    const stacks = stackIds.length === 0 ? "no stack" : stackIds.join(", ");
    const waits = earlier.length === 0 ? "" : `. Waits on every stack of ${listed3(earlier)}`;
    return `${index + 1}. ${phase}: ${stacks}${waits}`;
  });
}
function listed3(words) {
  return words.length <= 1 ? words[0] ?? "" : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}
function ignoreText({ glob, stacks }) {
  return `ignore ${JSON.stringify(glob)} leaves out ${plural(stacks.length, "stack")}: ${stacks.join(", ")}.`;
}
function unmatchedText(entry) {
  return `ignore ${JSON.stringify(entry.glob)} matches no stack. ${unmatchedWhy(entry)}`;
}
function unmatchedWhy({ hint }) {
  const why = "It is matched against the stack id, not the directory.";
  return hint === undefined ? why : `${why} ${JSON.stringify(hint.glob)} would leave out ${hint.stacks.join(", ")}.`;
}
function unclaimedText(count) {
  return `${plural(count, "file")} ${count === 1 ? "is" : "are"} claimed by no stack. A push that changes one of them gives a full scan.`;
}
function unrelatedBlock(existing, suggested) {
  const globs = [...new Set([...existing, ...suggested])];
  return ["scan:", "  unrelated:", ...globs.map((glob) => `    - ${JSON.stringify(glob)}`)];
}
function readText(read) {
  const shown = read.kind === "directory" ? `${read.path}/` : read.path;
  return `${read.stackId} reads ${shown}, named in ${read.namedIn}.`;
}
function readWarningText(read) {
  return `${readText(read)} A push that changes it does not preview ${read.stackId}. Add it to the inputs of the stack.`;
}
function inputsBlock(entries) {
  return [
    "stacks:",
    ...entries.flatMap(({ path, name, globs }) => [
      `  - path: ${JSON.stringify(path)}`,
      ...name === undefined ? [] : [`    name: ${JSON.stringify(name)}`],
      "    inputs:",
      ...globs.map((glob) => `      - ${JSON.stringify(glob)}`)
    ])
  ];
}
function askFailureText(reason) {
  return reason.kind === "timed-out" ? `the question timed out after ${reason.minutes} ${reason.minutes === 1 ? "minute" : "minutes"}` : previewFailureText(reason);
}
function backendText(check) {
  switch (check.found) {
    case true:
      return `${check.stackId} is in the backend.`;
    case false:
      return check.createInBackend ? `${check.stackId} is not in the backend, and the first scan creates it (createInBackend).` : `${check.stackId} is not in the backend.`;
    case "unknown":
      return `${check.stackId}: could not ask the backend, ${askFailureText(check.reason)}.`;
    case "unchecked":
      return `${check.stackId}: not checked, its tool has no list of stacks to ask.`;
  }
}
function notInBackendText(stackId) {
  return `${stackId} has files in the repo and no stack in the backend, so a scan gives its row a preview failure. Create the stack, or leave it out with the ignore block of this check.`;
}
function couldNotAskText(check) {
  return `${backendText(check)} The tool's own words are in the job log.`;
}
function ignoreBlock(existing, stackIds) {
  return [
    "ignore:",
    ...existing.flatMap((entry) => typeof entry === "string" ? [`  - ${JSON.stringify(entry)}`] : [
      `  - glob: ${JSON.stringify(entry.glob)}`,
      `    reason: ${JSON.stringify(entry.reason)}`
    ]),
    ...stackIds.map((id) => `  - ${JSON.stringify(globOf(id))}`)
  ];
}
function backendCell(check) {
  switch (check.found) {
    case true:
      return "Yes";
    case false:
      return check.createInBackend ? "No, the first scan creates it" : "No";
    case "unknown":
      return `Could not ask: ${askFailureText(check.reason)}`;
    case "unchecked":
      return "Not checked";
  }
}
function refText({ ref, refKind }) {
  switch (refKind) {
    case "moving":
      return `at ${ref}, which follows every release of ${ref}`;
    case "release":
      return `at ${ref}, one release that stays as it is`;
    case "commit":
      return `at commit ${ref.slice(0, 12)}, pinned`;
    case "other":
      return `at ${ref}, which is not a release`;
  }
}
function workflowJobText(path, job) {
  const mode = job.mode === undefined ? "no known mode" : job.mode === "auto" ? `mode auto, which runs ${job.runs.length === 0 ? "nothing on these triggers" : job.runs.join(", ")}` : `mode ${job.mode}`;
  return `${path}, job ${job.job}: ${mode}, ${refText(job)}.`;
}
function whoMayDeployText(path, job) {
  const { environment } = job;
  if (environment === undefined) {
    return `Who may deploy: ${path}, job ${job.job} names no GitHub Environment, so the tick rule alone decides who may deploy.`;
  }
  return `Who may deploy: ${path}, job ${job.job} deploys in the GitHub Environment ${environment}. The tick rule decides who may ask. If ${environment} has required reviewers, they decide who may deploy. Whether it has them is a setting of the repo, which the check cannot read.`;
}
function needsWho(mode) {
  return mode === "auto" ? "the modes it runs need" : `${mode} needs`;
}
var MODE_LIST = MODES.filter((mode) => mode !== "init").join(", ");
function workflowWarningText(warning) {
  const { path } = warning;
  switch (warning.kind) {
    case "unreadable":
      return `${path} is not valid YAML, so the check cannot read how it runs Sluiceway. The Actions tab of the repo shows GitHub's own error.`;
    case "unknown-mode":
      return `${path}, job ${warning.job}: the Sluiceway step has mode ${JSON.stringify(warning.mode)}, which does not exist. Leave the mode out, or use one of: ${MODE_LIST}.`;
    case "unreleased-ref":
      return `${path}, job ${warning.job}: sluiceway/sluiceway@${warning.ref} is not a release. A branch runs code that is not released yet. Use a major tag such as @v0 to follow every release, an exact tag such as @v0.8.0, or a full commit SHA.`;
    case "mixed-refs":
      return `${path} runs Sluiceway at ${warning.refs.join(" and ")}. Use one ref in every job, so that a scan and the deploy it leads to run the same version.`;
    case "missing-trigger":
      return MISSING_TRIGGER[warning.trigger](path);
    case "forbidden-trigger":
      if (warning.auto) {
        return `${path} runs on ${warning.trigger}, and its Sluiceway job loads the credentials of your stacks before it. On ${warning.trigger} those steps would run code that is not on the default branch yet. Keep the check in a workflow of its own, which needs no credentials.`;
      }
      return `${path} runs on ${warning.trigger}. A scan would write the dashboard from code that is not on the default branch yet. Only the workflow of the check may run on pull requests or in a merge queue.`;
    case "preview-on-target":
      return `${path}, job ${warning.job}: pull-request-preview: true runs on pull_request_target, which Sluiceway never previews on: it runs with the secrets of the base branch against code that is not merged. Run it on pull_request, where a fork's pull request is refused.`;
    case "missing-job":
      return `${path} has no ${warning.mode} job. The four jobs scan, resolve, apply and settle stay in one file: a scan looks for waiting ticks among the runs of its own workflow, and the rescan box and settle start that same workflow again.`;
    case "boxes-do-nothing":
      return `${path} scans, and no job in it resolves a tick, so a box on the dashboard does nothing. For a workflow that only scans, set dashboard.readOnly: true in sluiceway.yaml.`;
    case "no-permissions":
      return `${path}, job ${warning.job}: there is no permissions block, so the token gets the repo's default, which a file does not show. ${needsWho(warning.mode)} ${warning.needs.join(", ")}.`;
    case "missing-permissions":
      return `${path}, job ${warning.job}: ${needsWho(warning.mode)} ${warning.missing.join(", ")}. A job's own permissions replace the workflow's.`;
    case "no-concurrency":
      return `${path}, job ${warning.job}: there is no concurrency group. ${NO_CONCURRENCY[warning.mode]}`;
    case "auto-no-queue":
      return `${path}, job ${warning.job}: the concurrency group has no queue: max, so a run that waits is dropped when a newer one arrives, a push's scan or a deploy that a dispatch started with it.`;
    case "auto-cancels":
      return `${path}, job ${warning.job}: cancel-in-progress stops a deploy half way when a newer run arrives. Take it out of this job.`;
    case "apply-group-shared":
      return `${path}, job ${warning.job}: the concurrency group does not name the stack, so a deploy waits for the deploy of every other stack. Use group: sluiceway-apply-\${{ matrix.stack }}.`;
    case "apply-no-queue":
      return `${path}, job ${warning.job}: the concurrency group has no queue: max, so a deploy that waits is cancelled when a newer one for the same stack arrives.`;
    case "apply-cancels":
      return `${path}, job ${warning.job}: cancel-in-progress stops a deploy half way when a newer one for the same stack arrives. Take it out of this job.`;
    case "resolve-no-queue":
      return `${path}, job ${warning.job}: the concurrency group has no queue: max, so a resolve that waits is dropped when an edit of the dashboard starts a newer one. A dispatched run's resolve is the only one that hands on the deploy it carries, a record the app or another writer opened for that run or a queued stack, so that deploy never starts.`;
    case "resolve-cancels":
      return `${path}, job ${warning.job}: cancel-in-progress stops a resolve when a newer run arrives, and with it the deploy that a dispatched run carries. Take it out of this job.`;
    case "no-status-check":
      return warning.mode === "apply" ? `${path}, job ${warning.job}: the if: has no !cancelled(). Without a status check GitHub skips the deploys that resolve started whenever resolve itself ends red.` : `${path}, job ${warning.job}: the if: has no always(). settle exists for deploys that were cancelled or failed, and without always() GitHub skips it exactly then.`;
    case "settle-skips-apply":
      return `${path}, job ${warning.job}: settle does not wait for the job ${warning.apply}. Add ${warning.apply} to its needs, so it ends the records of those deploys too.`;
    case "settle-skips-cancelled-resolve":
      return `${path}, job ${warning.job}: the if: skips settle when ${warning.resolve} was cancelled, which hands nothing on. A record opened for the run then stays open and its row says deploying until a later scan. Add needs.${warning.resolve}.result == 'cancelled' as one more way in, as docs/split-workflow.md shows.`;
    case "no-merged-apply":
      return `${path}: mergeAndDeploy is on, and no apply job takes the matrix of the scan. The scan after a merge hands the deploy on through its own matrix output, so a merged update would never deploy. Add a copy of the apply job that takes needs.scan.outputs.matrix.`;
    case "no-on-merge-apply":
      return `${path}: a stack is set to deploy: on-merge, and no apply job takes the matrix of the scan. The scan of a merge hands that deploy on through its own matrix output, so it would never start. Add a copy of the apply job that takes needs.scan.outputs.matrix.`;
    case "scan-no-matrix-output":
      return `${path}, job ${warning.job}: it takes the matrix of the job ${warning.scan}, which has no matrix output. Add outputs: matrix: \${{ steps.<id>.outputs.matrix }} to ${warning.scan}, with that id on its Sluiceway step.`;
  }
}
var MISSING_TRIGGER = {
  push: (path) => `${path} scans and has no push trigger. A push to the default branch starts the scan that shows its change as pending.`,
  schedule: (path) => `${path} scans and has no schedule. The daily full scan catches a change that is not a file in the repo, such as another stack's output.`,
  workflow_dispatch: (path) => `${path} has no workflow_dispatch trigger. The rescan box and settle start a scan through it.`,
  issues: (path) => `${path} has a resolve job and does not listen to issue edits (issues, with the type edited). A tick would start nothing.`
};
var NO_CONCURRENCY = {
  auto: "Two runs could scan or deploy at once. Use one group with queue: max, such as group: sluiceway-${{ github.event.issue.number }}, so the runs wait in line and an edit of another issue waits for none of them.",
  scan: "Scans would run side by side. Use concurrency: sluiceway-scan, so they run one at a time.",
  resolve: "Two runs could handle the same tick. Use group: sluiceway-resolve with queue: max, so ticks are handled one run at a time and a waiting run is never dropped.",
  apply: "Two deploys of one stack could run at once. Use a group per stack, group: sluiceway-apply-${{ matrix.stack }}, with queue: max."
};
function workflowNoteText(note) {
  switch (note.kind) {
    case "no-preview-pages":
      return `${note.path}, job ${note.job}: without checks: write there are no preview pages, and a pending row's preview link opens the run's summary.`;
    case "called":
      return `${note.path} is called from another workflow. Its triggers and permissions come from the caller, which the check does not follow.`;
  }
}
function scansSomewhere(workflows) {
  return workflows.workflows.some(({ jobs }) => jobs.some((job) => job.runs.includes("scan")));
}
function checkParts(facts) {
  const { report } = facts;
  return [
    headerPart(facts.hasConfigFile, facts.recordWriters ?? []),
    freezesPart(facts.endedFreezes ?? [], facts.timeZone),
    stacksPart(report),
    discoveryPart(facts.discovery ?? []),
    phasesPart(report.phases),
    ignorePart(report.ignore),
    unclaimedPart(report, facts.unrelated),
    readsPart(report),
    workflowsPart(facts.workflows),
    credentialsPart(facts.credentials)
  ];
}
function headerPart(hasConfigFile, recordWriters) {
  const noFile = hasConfigFile ? [] : [NO_CONFIG_FILE];
  const writers = recordWriters.length === 0 ? [] : [recordWritersText(recordWriters)];
  return {
    log: [...noFile, ...writers].map((text) => ({ info: text })),
    summary: ["## Sluiceway check", VALID, ...noFile, ...writers]
  };
}
function recordWritersText(recordWriters) {
  return `Record writers: ${recordWriters.join(", ")}. A deployment record one of them opens that names a dispatched or scheduled run is deployed by that run, through the fresh preview and the hash check (recordWriters).`;
}
function freezesPart(ended, timeZone) {
  const text = ({ index, reason, ended: at }, markdown) => {
    const key = markdown ? `\`freezes[${index}]\`` : `freezes[${index}]`;
    const why = reason === undefined ? "" : ` (${markdown ? escapeText(reason) : reason})`;
    return `${key}${why} ended ${minuteAt(at, timeZone)} and holds nothing any more. Take it out of sluiceway.yaml.`;
  };
  return {
    log: ended.map((one) => ({
      warning: text(one, false),
      title: "A deploy freeze already ended"
    })),
    summary: ended.length === 0 ? [] : ["### Deploy freezes", ...ended.map((one) => text(one, true))]
  };
}
function stacksPart({ stacks, phases }) {
  const found = foundText(stacks.length);
  if (stacks.length === 0)
    return { log: [{ info: found }], summary: ["### Stacks", found] };
  const waits = stacks.some((configured) => configured.dependsOn !== undefined || configured.dependsOnAuto);
  const phased = stacks.some((configured) => configured.phase !== undefined);
  const onMerge = stacks.some((configured) => configured.deploy === "on-merge");
  return {
    log: [
      { info: found },
      {
        group: "Stacks",
        lines: stacks.map((configured) => line(`${stackId(configured.stack)}: ${settingsText(configured, phases)}`))
      }
    ],
    summary: [
      "### Stacks",
      found,
      [
        `| Stack | Environment | Tickers | Inputs |${phased ? " Phase |" : ""}${waits ? " Depends on |" : ""}${onMerge ? " Deploys |" : ""}`,
        `|---|---|---|---|${phased ? "---|" : ""}${waits ? "---|" : ""}${onMerge ? "---|" : ""}`,
        ...stacks.map((configured) => {
          const { environment, tickers, inputs } = configured;
          return row([
            stackId(configured.stack),
            environment,
            typeof tickers === "string" ? tickers : tickers.join(", "),
            inputs.length === 0 ? "none" : inputs.join(", "),
            ...phased ? [configured.phase === undefined ? "none" : phaseWords(configured, ", from ", "")] : [],
            ...waits ? [dependsOnCell(configured, phases)] : [],
            ...onMerge ? [configured.deploy === "on-merge" ? "on merge" : "on a tick"] : []
          ]);
        })
      ].join(`
`)
    ]
  };
}
var DISCOVERY_TITLE = "Root modules found from their files";
var DISCOVERY_HINT = "A stacks entry with tool declares a directory it left out, and ignore or discovery.rootModules: false leaves out one it found.";
function discoveryPart(notes) {
  if (notes.length === 0)
    return { log: [], summary: [] };
  const found = notes.filter((note) => note.outcome === "found").length;
  const left = notes.filter((note) => note.outcome === "left-out").length;
  const count = `Discovery found ${found === 0 ? "no root module" : plural(found, "root module")}${left === 0 ? "" : ` and left out ${left} ${left === 1 ? "directory" : "directories"}`}.`;
  return {
    log: [
      { info: count },
      {
        group: DISCOVERY_TITLE,
        lines: notes.map(({ path, outcome, because }) => line(outcome === "declared" ? `${path}: ${because}` : `${path}: ${outcome === "found" ? "found" : "left out"}, ${because}`))
      }
    ],
    summary: [
      `### ${DISCOVERY_TITLE}`,
      `${count} ${DISCOVERY_HINT}`,
      [
        "| Directory | Stack | Why |",
        "|---|---|---|",
        ...notes.map(({ path, outcome, stackId, because }) => row([
          path,
          outcome === "found" ? stackId ?? path : outcome === "declared" ? "declared" : "none",
          because
        ]))
      ].join(`
`)
    ]
  };
}
function phasesPart(phases) {
  if (phases.length === 0)
    return { log: [], summary: [] };
  return {
    log: [{ group: "Phases", lines: phaseLines(phases).map(line) }],
    summary: [
      "### Phases",
      [
        "| Phase | Stacks | Waits on |",
        "|---|---|---|",
        ...phases.map(({ phase, stackIds }, index) => {
          const earlier = phases.slice(0, index).map((one) => one.phase);
          return row([
            phase,
            stackIds.length === 0 ? "none" : stackIds.join(", "),
            earlier.length === 0 ? "nothing" : earlier.join(", ")
          ]);
        })
      ].join(`
`)
    ]
  };
}
function ignorePart(ignore) {
  if (ignore.length === 0)
    return { log: [], summary: [] };
  return {
    log: ignore.map((entry) => entry.stacks.length > 0 ? { info: line(ignoreText(entry)) } : { warning: line(unmatchedText(entry)), title: "An ignore glob matches no stack" }),
    summary: [
      "### Ignore",
      [
        "| Glob | Leaves out |",
        "|---|---|",
        ...ignore.map((entry) => row([
          entry.glob,
          entry.stacks.length > 0 ? entry.stacks.join(", ") : `No stack. ${unmatchedWhy(entry)}`
        ]))
      ].join(`
`)
    ]
  };
}
function unclaimedPart(report, unrelated) {
  const heading = "### Files that no stack claims";
  const files = report.unclaimed.flatMap((group) => group.files);
  if (files.length === 0) {
    const configFile = report.configFile === undefined ? "" : ` ${escapeText(report.configFile)} is not listed: no stack claims it, and a change to it previews every stack.`;
    return {
      log: [],
      summary: [
        heading,
        `Every file is claimed by a stack, covered by scan.unrelated, or one of the docs and tooling files that force nothing by default.${configFile}`
      ]
    };
  }
  const count = unclaimedText(files.length);
  const block = report.suggested.length === 0 ? [] : unrelatedBlock(unrelated, report.suggested);
  return {
    log: [
      { info: count },
      { group: "Files that no stack claims", lines: files.map(line) },
      { info: whereFilesBelong(report.shared) },
      ...block.length === 0 ? [] : [{ group: "Ready to paste into sluiceway.yaml", lines: block.map(line) }]
    ],
    summary: [
      heading,
      count,
      report.unclaimed.map(groupLine).join(`
`),
      whereFilesBelong(report.shared, escapeText),
      ...block.length === 0 ? [] : [PASTE_NOTE, yaml(block)]
    ]
  };
}
function readsPart({ reads, inputs }) {
  if (reads.length === 0)
    return { log: [], summary: [] };
  const block = inputsBlock(inputs);
  return {
    log: [
      { group: READS_TITLE, lines: reads.map((read) => line(readText(read))) },
      ...reads.filter((read) => read.missed).map((read) => ({ warning: line(readWarningText(read)), title: READ_WARNING_TITLE })),
      { info: READS_NOTE },
      { group: READS_PASTE_TITLE, lines: block.map(line) }
    ],
    summary: [
      `### ${READS_TITLE}`,
      reads.map((read) => `- ${escapeText(read.missed ? readWarningText(read) : readText(read))}`).join(`
`),
      READS_NOTE,
      yaml(block)
    ]
  };
}
function waysText(need) {
  const words = need.ways.map(wayWords);
  if (words.length <= 1)
    return words[0] ?? "";
  if (words.length === 2)
    return `${words[0]} or ${words[1]}`;
  return `${words.slice(0, -1).join(", ")}, or ${words.at(-1)}`;
}
function needText(stackId, need) {
  const ways = need.ways.length === 0 ? `${need.what}, which the check has no table for` : `${need.what}: ${waysText(need)}`;
  return `${stackId} needs ${ways}. Named in ${need.namedIn}.`;
}
function unmetWays(need) {
  const words = need.ways.map(wayWords);
  return words.length <= 1 ? words[0] ?? "" : `${words.slice(0, -1).join(", ")} or ${words.at(-1)}`;
}
function unmetLines({ path, job, judged }) {
  const unmet = judged.filter((one) => one.met === false);
  const grouped = Map.groupBy(unmet, (one) => `${one.need.what}
${unmetWays(one.need)}`);
  return [...grouped.values()].map((ones) => {
    const first = ones[0];
    const stacks = [...new Set(ones.map((one) => one.stackId))];
    const who = `${listed3(stacks)} ${stacks.length === 1 ? "needs" : "need"}`;
    const maybe = [...new Set(ones.flatMap((one) => one.maybe))];
    const opaque = maybe.length === 0 ? "" : maybe.length === 1 ? ` The step ${maybe[0]} may load it, and the check cannot see into it.` : ` The steps ${listed3(maybe)} may load it, and the check cannot see into them.`;
    const unread = [...new Set(ones.flatMap((one) => one.unread))];
    const files = unread.length === 0 ? "" : unread.length === 1 ? ` The envFile ${unread[0]} of the stack may list it, and the check cannot read it.` : ` The envFiles ${listed3(unread)} of the stacks may list it, and the check cannot read them.`;
    return `Nothing in ${path}, job ${job} provides ${unmetWays(first.need)}, which ${who} for ${first.need.what}.${opaque}${files}`;
  });
}
function providesLine({ path, job }) {
  return `${path}, job ${job} names a way to every credential the stacks' files ask for.`;
}
function credentialsPart({ stacks, jobs }) {
  if (stacks.length === 0)
    return { log: [], summary: [] };
  const lines = stacks.map(({ stackId, needs }) => needs.length === 0 ? `${stackId} needs nothing that its files name.` : needs.map((need) => needText(stackId, need)));
  const rows = stacks.flatMap(({ stackId, needs }) => needs.length === 0 ? [row([stackId, "nothing that its files name", "", ""])] : needs.map((need) => row([
    stackId,
    need.what,
    need.ways.length === 0 ? "the check has no table for it" : waysText(need),
    need.namedIn
  ])));
  const perJob = jobs.map((one) => {
    const unmet = unmetLines(one);
    return { one, lines: unmet.length === 0 ? [providesLine(one)] : unmet };
  });
  return {
    log: [
      { group: NEEDS_TITLE, lines: lines.flat().map(line) },
      ...perJob.flatMap(({ one, lines: texts }) => [
        {
          group: `What ${one.path}, job ${one.job} provides`,
          lines: one.judged.filter((judged) => judged.met === true).map((judged) => line(`${judged.stackId}, ${judged.need.what}: ${judged.by}.`))
        },
        ...texts.map((text) => ({ info: line(text) }))
      ])
    ],
    summary: [
      "### Credentials",
      CREDENTIALS_NOTE,
      ["| Stack | Needs | Any one of | Named in |", "|---|---|---|---|", ...rows].join(`
`),
      ...perJob.length === 0 ? [] : [
        perJob.flatMap(({ lines: texts }) => texts.map((text) => `- ${escapeText(text)}`)).join(`
`)
      ]
    ]
  };
}
function workflowsPart(workflows) {
  const listed = workflows.workflows.length > 0;
  const noScan = scansSomewhere(workflows) ? [] : [NO_SCAN_WORKFLOW];
  const warnings = workflows.warnings.map(workflowWarningText);
  const notes = workflows.notes.map(workflowNoteText);
  const nothingMissing = listed && warnings.length === 0 ? [NOTHING_MISSING] : [];
  const deployers = workflows.workflows.flatMap(({ path, jobs }) => jobs.filter((job) => job.runs.includes("apply")).map((job) => whoMayDeployText(path, job)));
  const bullets = (texts) => texts.length === 0 ? [] : [texts.map((text) => `- ${escapeText(text)}`).join(`
`)];
  return {
    log: [
      ...listed ? [
        {
          group: "Workflows",
          lines: workflows.workflows.flatMap(({ path, jobs }) => jobs.map((job) => line(workflowJobText(path, job))))
        }
      ] : [],
      ...deployers.map((text) => ({ info: line(text) })),
      ...noScan.map((text) => ({ info: text })),
      ...warnings.map((text) => ({ warning: line(text), title: WORKFLOW_WARNING_TITLE })),
      ...notes.map((text) => ({ info: line(text) })),
      ...nothingMissing.map((text) => ({ info: text }))
    ],
    summary: [
      "### Workflows",
      ...listed ? [
        [
          "| Workflow | Job | Mode | Action ref |",
          "|---|---|---|---|",
          ...workflows.workflows.flatMap(({ path, jobs }) => jobs.map((job) => row([path, job.job, job.mode ?? "none", refText(job)])))
        ].join(`
`)
      ] : [],
      ...bullets(deployers),
      ...noScan,
      ...bullets(warnings),
      ...bullets(notes),
      ...nothingMissing,
      WORKFLOWS_AS_TEXT
    ]
  };
}
function backendPart(checks, ignore, toolLog) {
  const notThere = checks.filter((check) => check.found === false);
  const missing = notThere.filter((check) => !check.createInBackend).map((check) => check.stackId);
  const block = missing.length === 0 ? [] : ignoreBlock(ignore, missing);
  const allIn = notThere.length === 0 && checks.some((check) => check.found === true);
  return {
    log: [
      ...toolLog === "" ? [] : [{ group: "The tool's own words", lines: toolLog.replace(/\n$/, "").split(`
`) }],
      { group: BACKEND_TITLE, lines: checks.map((check) => line(backendText(check))) },
      ...checks.flatMap((check) => {
        if (check.found === "unknown") {
          return [{ warning: line(couldNotAskText(check)), title: COULD_NOT_ASK_TITLE }];
        }
        if (check.found === false && !check.createInBackend) {
          return [{ warning: line(notInBackendText(check.stackId)), title: NOT_IN_BACKEND_TITLE }];
        }
        return [];
      }),
      ...block.length === 0 ? [] : [{ info: BACKEND_PASTE_NOTE }, { group: BACKEND_PASTE_TITLE, lines: block.map(line) }],
      ...allIn ? [{ info: ALL_IN_BACKEND }] : []
    ],
    summary: [
      "### The backend",
      [
        "| Stack | In the backend |",
        "|---|---|",
        ...checks.map((check) => row([check.stackId, backendCell(check)]))
      ].join(`
`),
      ...block.length === 0 ? [] : [BACKEND_PASTE_NOTE, yaml(block)],
      ...allIn ? [ALL_IN_BACKEND] : []
    ]
  };
}
function closingPart(askedBackend, previewedPullRequest = false) {
  const cannot = askedBackend ? [CANNOT_TELL_WITH_BACKEND] : [CANNOT_TELL, BACKEND_OFF];
  if (previewedPullRequest)
    cannot.push(PREVIEWED_PULL_REQUEST);
  return {
    log: [VALID, ...cannot].map((text) => ({ info: text })),
    summary: ["### What a check cannot tell", ...cannot]
  };
}
function renderCheckSummary(parts) {
  return `${parts.flatMap((part) => part.summary).join(`

`)}
`;
}
function renderCheckFailure(kind, problems) {
  const title = kind === "config" ? "sluiceway.yaml is not valid." : "Could not work out the stacks of this repo.";
  return `${[
    "## Sluiceway check",
    title,
    problems.map((problem) => `- ${escapeText(problem)}`).join(`
`),
    "Fix these and run the check again. A scan stops at the same place."
  ].join(`

`)}
`;
}
function groupLine({ directory, files }) {
  const where = directory === "." ? "The repo root" : escapeText(`${directory}/`);
  const shown = files.slice(0, FILES_PER_DIRECTORY).map(escapeText).join(", ");
  const rest = files.length - FILES_PER_DIRECTORY;
  const more = rest > 0 ? `, and ${plural(rest, "more file")}. The job log lists them all.` : "";
  return `- ${where}, ${plural(files.length, "file")}: ${shown}${more}`;
}
function row(cells) {
  return `| ${cells.map(escapeText).join(" | ")} |`;
}
function yaml(lines) {
  return ["```yaml", ...lines, "```"].join(`
`);
}
var line = logGroupTitle;

// src/modes/check.ts
async function check(context) {
  const { log, root } = context;
  let config;
  let report;
  let discovery;
  const needs = [];
  try {
    config = loadConfig(root);
    const found = await context.adapter.discover(root, config);
    discovery = await context.adapter.explainDiscovery?.(root, config) ?? [];
    const references = new Map;
    const readsFiles = context.adapter.readsFiles;
    if (readsFiles !== undefined) {
      for (const stack of found)
        references.set(stackId(stack), await readsFiles(root, stack));
    }
    report = checkSetup(config, found, await repoFiles(root), references);
    const credentialNeeds = context.adapter.credentialNeeds;
    if (credentialNeeds !== undefined) {
      for (const { stack, envFile } of report.stacks) {
        needs.push({
          stackId: stackId(stack),
          needs: await credentialNeeds(root, stack),
          ...envFile === undefined ? {} : { envFile }
        });
      }
    }
  } catch (error) {
    if (error instanceof ConfigError || error instanceof DiscoveryError) {
      await summary(context, renderCheckFailure(error instanceof ConfigError ? "config" : "discovery", error.problems));
    }
    throw error;
  }
  const workflows = checkWorkflows(readWorkflowFiles(root), config);
  const parts = checkParts({
    report,
    discovery,
    workflows,
    credentials: { stacks: needs, jobs: judgeJobs(needs, workflows.workflows, root) },
    unrelated: config.scan.unrelated,
    hasConfigFile: hasConfigFile(root),
    recordWriters: config.recordWriters,
    endedFreezes: endedFreezes(config.freezes, (context.now ?? (() => new Date))(), config.dashboard.timeZone).map(({ freeze, ended }) => ({
      index: config.freezes.indexOf(freeze),
      reason: freeze.reason,
      ended
    })),
    timeZone: config.dashboard.timeZone
  });
  for (const part of parts)
    write(log, part);
  if (context.backend !== undefined) {
    const { checks, toolLog } = await askBackend(context.backend, root, report.stacks);
    const backend = backendPart(checks, config.ignore, toolLog);
    write(log, backend);
    parts.push(backend);
  }
  if (context.pullRequestPreview !== undefined) {
    const preview = await context.pullRequestPreview({ config, stacks: report.stacks });
    write(log, preview);
    parts.push(preview);
  }
  const closing = closingPart(context.backend !== undefined, context.pullRequestPreview !== undefined);
  await summary(context, renderCheckSummary([...parts, closing]));
  write(log, closing);
}
async function askBackend(backend, root, stacks) {
  const envs = backend.stackEnvs(stacks.map(({ stack, envFile }) => ({ id: stackId(stack), envFile })));
  const answers = new Map;
  const logs = [];
  for (const group of Map.groupBy(stacks, (one) => one.envFile).values()) {
    const first = group[0];
    if (first === undefined)
      continue;
    const own = envs.get(stackId(first.stack));
    if (own?.ok === false) {
      for (const { stack } of group) {
        answers.set(stackId(stack), {
          stack,
          found: "unknown",
          reason: { kind: "env-file-not-loaded" }
        });
      }
      continue;
    }
    const result = await backend.adapter.findInBackend?.(group.map(({ stack }) => stack), { root, env: own?.ok ? own.env : backend.env, run: backend.run });
    for (const answer of result?.answers ?? [])
      answers.set(stackId(answer.stack), answer);
    if (result !== undefined && result.toolLog !== "")
      logs.push(result.toolLog);
  }
  const checks = stacks.map(({ stack, createInBackend }) => {
    const id = stackId(stack);
    const answer = answers.get(id);
    const creates = createInBackend === undefined ? {} : { createInBackend };
    if (answer === undefined)
      return { stackId: id, ...creates, found: "unchecked" };
    return answer.found === "unknown" ? { stackId: id, ...creates, found: "unknown", reason: answer.reason } : { stackId: id, ...creates, found: answer.found };
  });
  return { checks, toolLog: logs.join("") };
}
function write(log, { log: entries }) {
  for (const entry of entries) {
    if ("info" in entry)
      log.info(entry.info);
    else if ("warning" in entry)
      log.warning(entry.warning, entry.title);
    else
      log.group(entry.group, entry.lines);
  }
}
async function summary(context, text) {
  try {
    await context.log.writeSummary(text);
  } catch (error) {
    context.log.info(`Writing the summary failed: ${error instanceof Error ? error.message : error}`);
  }
}

// src/modes/init.ts
import { existsSync as existsSync2, mkdirSync, readFileSync as readFileSync10, statSync as statSync5, writeFileSync } from "node:fs";
import { dirname, join as join14 } from "node:path";

// src/adapters/init-findings.ts
import { posix as posix4 } from "node:path";

// src/core/env-file.ts
var SECRET_REFERENCE = "op://";

// src/core/init-findings.ts
function openTofuStacks(root) {
  if (root.varFiles.length === 0)
    return [{}];
  const [only] = root.varFiles;
  if (root.varFiles.length === 1 && only !== undefined)
    return [{ varFile: only }];
  return root.varFiles.map((varFile) => ({ name: varFileName(varFile), varFile }));
}
function varFileName(file) {
  return file.replace(/\.tfvars(\.json)?$/, "");
}

// src/adapters/init-findings.ts
var SKIPPED4 = /(^|\/)(\.terraform|node_modules|\.git)(\/|$)/;
function findDeclarable(files, read, taken) {
  const used = new Set(taken);
  const opentofu = openTofuRoots(files, read).filter(({ path }) => !used.has(path));
  for (const { path } of opentofu)
    used.add(path);
  const helm = helmCharts(files, read).filter(({ path }) => !used.has(path));
  return { opentofu, helm };
}
function openTofuRoots(files, read) {
  const code = files.filter((file) => /\.(tf|tofu)$/.test(file) && !SKIPPED4.test(file));
  const directories = [...new Set(code.map(directoryOf))];
  const called = new Set(code.flatMap((file) => [...(read(file) ?? "").matchAll(/^\s*source\s*=\s*"(\.\.?\/[^"]*)"/gm)].map((match) => normal(posix4.join(directoryOf(file), match[1] ?? "")))));
  return directories.filter((path) => !called.has(path) && !path.split("/").includes("modules")).sort(byCodeUnit).map((path) => ({
    path,
    varFiles: files.filter((file) => directoryOf(file) === path).map((file) => posix4.basename(file)).filter((name) => /\.tfvars(\.json)?$/.test(name)).filter((name) => !/^terraform\.tfvars(\.json)?$|\.auto\.tfvars(\.json)?$/.test(name)).sort(byCodeUnit)
  }));
}
function helmCharts(files, read) {
  const charts = files.filter((file) => /(^|\/)Chart\.yaml$/.test(file) && !SKIPPED4.test(file));
  const chartDirectories = new Set(charts.map(directoryOf));
  return charts.flatMap((file) => {
    const path = directoryOf(file);
    const parent = directoryOf(path);
    if (posix4.basename(parent) === "charts" && chartDirectories.has(directoryOf(parent))) {
      return [];
    }
    const chart = yamlObject(read(file));
    if (chart === undefined || chart.type === "library")
      return [];
    const release = releaseName(typeof chart.name === "string" ? chart.name : "", path);
    return release === undefined ? [] : [{ path, release }];
  }).sort((a, b) => byCodeUnit(a.path, b.path));
}
function releaseName(name, path) {
  for (const candidate of [name, posix4.basename(path)]) {
    const cleaned = candidate.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 53).replace(/-+$/, "");
    if (cleaned !== "")
      return cleaned;
  }
  return;
}
var LOCKFILES = [
  ["package-lock.json", "npm"],
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"]
];
function findForWorkflow(stacks, files, read) {
  const tool = (stack) => stack.options.tool;
  const pulumiPaths = [
    ...new Set(stacks.filter((stack) => tool(stack) === undefined).map((s) => s.path))
  ];
  const runtimes = pulumiPaths.map((path) => ({ path, runtime: pulumiRuntime(path, files, read) }));
  const nodePaths = runtimes.filter(({ runtime }) => runtime === "nodejs").map((p) => p.path);
  const other = Map.groupBy(runtimes.filter(({ runtime }) => runtime !== "nodejs" && runtime !== "yaml"), ({ runtime }) => runtime);
  return {
    pulumi: pulumiPaths.length > 0,
    opentofu: stacks.some((stack) => tool(stack) === OPENTOFU),
    helm: stacks.some((stack) => tool(stack) === HELM),
    kubectl: stacks.some((stack) => tool(stack) === KUBECTL),
    node: nodePaths.length === 0 ? undefined : nodeFindings(nodePaths, files, read),
    otherRuntimes: [...other].map(([runtime, found]) => ({ runtime, paths: found.map(({ path }) => path) })).sort((a, b) => byCodeUnit(a.runtime, b.runtime)),
    helmRepositories: helmRepositories(stacks, read),
    envFiles: envFiles(files, read)
  };
}
function pulumiRuntime(path, files, read) {
  const file = ["Pulumi.yaml", "Pulumi.yml", "Pulumi.json"].map((name) => path === "." ? name : `${path}/${name}`).find((candidate) => files.includes(candidate));
  const project = file === undefined ? undefined : yamlObject(read(file));
  const runtime = project?.runtime;
  if (typeof runtime === "string")
    return runtime;
  if (typeof runtime === "object" && runtime !== null && "name" in runtime) {
    return typeof runtime.name === "string" ? runtime.name : "yaml";
  }
  return "yaml";
}
function nodeFindings(paths, files, read) {
  const lockfile = (directory) => LOCKFILES.find(([name]) => files.includes(directory === "." ? name : `${directory}/${name}`));
  const installs = new Map;
  const withoutLockfile = [];
  for (const path of paths) {
    const directory = ancestors2(path).find((candidate) => lockfile(candidate) !== undefined);
    const found = directory === undefined ? undefined : lockfile(directory);
    if (directory === undefined || found === undefined)
      withoutLockfile.push(path);
    else
      installs.set(directory, found[1]);
  }
  const managers = new Set(installs.values());
  const manifest = yamlObject(read("package.json"));
  return {
    installs: [...installs].map(([directory, manager]) => ({ directory, manager })).sort((a, b) => byCodeUnit(a.directory, b.directory)),
    withoutLockfile,
    versionFile: [".nvmrc", ".node-version"].find((file) => files.includes(file)),
    yarnBerry: managers.has("yarn") && files.includes(".yarnrc.yml"),
    pnpmWithoutVersion: managers.has("pnpm") && !(typeof manifest?.packageManager === "string" && manifest.packageManager.startsWith("pnpm@"))
  };
}
function helmRepositories(stacks, read) {
  const repositories = stacks.flatMap((stack) => {
    const chartDir = stack.options.tool === HELM ? stack.options.chartDir : undefined;
    if (typeof chartDir !== "string")
      return [];
    const chart = yamlObject(read(chartDir === "." ? "Chart.yaml" : `${chartDir}/Chart.yaml`));
    const dependencies = Array.isArray(chart?.dependencies) ? chart.dependencies : [];
    return dependencies.flatMap((dependency) => {
      const repository = dependency?.repository;
      return typeof repository === "string" && /^https?:\/\//.test(repository) ? [repository] : [];
    });
  });
  return [...new Set(repositories)].sort(byCodeUnit);
}
function envFiles(files, read) {
  const found = files.filter((file) => /(^|\/)(\.env(\.[^/]+)?|[^/]+\.env)$/.test(file)).filter((file) => /^[\w./-]+$/.test(file)).filter((file) => (read(file) ?? "").split(`
`).some((line) => /^\s*(export\s+)?[A-Za-z_]\w*\s*=/.test(line) && line.includes(SECRET_REFERENCE)));
  if (found.length === 0)
    return;
  const named = (pattern) => found.find((file) => pattern.test(posix4.basename(file)));
  const deploy = named(/deploy|apply|write/i);
  const preview = named(/preview|read|scan|plan/i);
  const [first] = found;
  const pair = deploy !== undefined && preview !== undefined && deploy !== preview ? { preview, deploy } : { preview: first, deploy: first };
  return {
    ...pair,
    others: found.filter((file) => file !== pair.preview && file !== pair.deploy)
  };
}
function yamlObject(text) {
  if (text === undefined)
    return;
  try {
    const value = $parse(text, { uniqueKeys: false });
    return typeof value === "object" && value !== null && !Array.isArray(value) ? value : undefined;
  } catch {
    return;
  }
}
function ancestors2(path) {
  const found = [path];
  let current = path;
  while (current !== ".") {
    current = directoryOf(current);
    found.push(current);
  }
  return found;
}
function directoryOf(file) {
  const directory = posix4.dirname(file);
  return directory === "" ? "." : directory;
}
function normal(path) {
  const joined = posix4.normalize(path).replace(/\/$/, "");
  return joined === "" ? "." : joined;
}

// examples/workflows/export-env.sh
var export_env_default = `#!/usr/bin/env bash
# Loads an env file of secret references into the job environment, masked.
# Run it inside your secret manager's \`run\` command, which resolves every
# reference of the file into this process's environment, for example:
#
#   op run --env-file=ci.env --no-masking -- bash export-env.sh ci.env
#
# It prints nothing but ::add-mask:: commands. Never add \`set -x\` or an echo.
set -euo pipefail
file="$1"
# A line whose value holds this is a secret. Every other line is a plain value.
reference="\${SECRET_REFERENCE:-op://}"

while IFS= read -r raw || [ -n "$raw" ]; do
  raw="\${raw%$'\\r'}"
  # Take NAME from lines like \`NAME=...\`, \`NAME = ...\` or \`export NAME=...\`.
  [[ "$raw" =~ ^[[:space:]]*(export[[:space:]]+)?([A-Za-z_][A-Za-z0-9_]*)[[:space:]]*= ]] || continue
  name="\${BASH_REMATCH[2]}"
  # The secret manager's own token and settings stay on this step, and the
  # runner does not let a step set its own names.
  case "$name" in OP_* | GITHUB_* | RUNNER_*) continue ;; esac
  value="\${!name-}"
  [ -n "$value" ] || continue

  # Mask first, every line on its own, because the log is matched line by line.
  if [[ "$raw" == *"$reference"* ]]; then
    while IFS= read -r line || [ -n "$line" ]; do
      line="\${line%$'\\r'}"
      [ -n "$line" ] || continue
      printf '::add-mask::%s\\n' "\${line//%/%25}"
    done <<<"$value"
  fi

  # Then write, in the delimiter form so that newlines survive.
  delimiter="ghadelimiter_$(od -An -N16 -tx1 /dev/urandom | tr -d ' \\n')"
  if [[ "$value" == *"$delimiter"* ]]; then
    echo "The value of $name holds the delimiter. Run the step again." >&2
    exit 1
  fi
  printf '%s<<%s\\n%s\\n%s\\n' "$name" "$delimiter" "$value" "$delimiter" >>"$GITHUB_ENV"
done <"$file"
`;

// src/render/docs-site.ts
var DOCS_SITE = "https://docs.sluiceway.dev";
var DOCS = {
  home: `${DOCS_SITE}/`,
  configuration: `${DOCS_SITE}/guides/configuration/`,
  credentials: `${DOCS_SITE}/guides/credentials/#recipes`,
  credentialsHelm: `${DOCS_SITE}/guides/credentials/#helm`,
  credentialsKubectl: `${DOCS_SITE}/guides/credentials/#kubernetes-manifests`,
  init: `${DOCS_SITE}/guides/init/`,
  workflow: `${DOCS_SITE}/guides/workflow/`,
  exampleWorkflows: `${DOCS_SITE}/guides/example-workflows/#what-to-change`,
  pinACommit: `${DOCS_SITE}/guides/workflow/#pin-a-commit`,
  splitWorkflow: `${DOCS_SITE}/guides/split-workflow/`
};

// src/render/init.ts
var WORKFLOW_FILE = ".github/workflows/deploy-dashboard.yml";
var EXPORT_ENV_FILE = ".github/scripts/export-env.sh";
var EXPORT_ENV = export_env_default;
var DEFAULT_BRANCH = "main";
var RUNS_ON = "ubuntu-latest";
function starterWorkflow(options) {
  const { findings, merges } = options;
  const branch = options.branch ?? DEFAULT_BRANCH;
  const lines = [
    "# Written by sluiceway init from the files of this repo. Review every step",
    "# before you commit it, and change what init printed it could not know:",
    `# ${DOCS.exampleWorkflows}`,
    "#",
    "# `@v0` follows every release until 1.0.0. To review every update yourself,",
    `# pin a full commit SHA instead: ${DOCS.pinACommit}`,
    "name: deploy-dashboard",
    "",
    "on:",
    "  push:",
    `    branches: [${quotedIfNeeded(branch)}]`,
    "  schedule:",
    '    - cron: "0 6 * * *"',
    "  workflow_dispatch:",
    ...merges ? [
      "    inputs:",
      `      ${MERGE_SCAN_INPUT}:`,
      "        description: Set by Sluiceway after a merge from the dashboard. Leave it empty.",
      "        required: false"
    ] : [],
    "  issues:",
    "    types: [edited]",
    "",
    "permissions:",
    ...PERMISSIONS.map((line) => merges && line.startsWith("contents:") ? "  contents: write" : `  ${line}`),
    "",
    "jobs:",
    "  sluiceway:",
    `    runs-on: ${RUNS_ON}`,
    "    timeout-minutes: 60",
    "    # One run at a time and none dropped. An edit of any other issue gets a",
    "    # group of its own, so it never waits for a scan or a deploy.",
    "    concurrency:",
    "      group: sluiceway-${{ github.event.issue.number }}",
    "      queue: max",
    "    steps:",
    "      - uses: actions/checkout@v7",
    ...toolSteps(findings),
    ...credentialSteps(findings.envFiles),
    "      # It reads the event of the run: it scans, or deploys what a tick asks for.",
    "      # It runs after a step above failed too, and then only says so on the",
    "      # dashboard, so it never looks fresh while no scan could run.",
    "      - uses: sluiceway/sluiceway@v0",
    "        if: ${{ !cancelled() }}"
  ];
  return `${lines.join(`
`)}
`;
}
var PERMISSIONS = [
  "contents: read",
  "issues: write",
  "deployments: write",
  "actions: write",
  "pull-requests: read",
  "checks: write"
];
function toolSteps(findings) {
  return [
    ...findings.node === undefined ? [] : nodeSteps(findings.node),
    ...findings.pulumi ? pulumiSteps(findings) : [],
    ...findings.opentofu ? OPENTOFU_STEPS : [],
    ...findings.helm ? helmSteps(findings.helmRepositories) : [],
    ...findings.kubectl ? KUBECTL_STEPS : []
  ];
}
var LOCKFILE = {
  npm: "package-lock.json",
  pnpm: "pnpm-lock.yaml",
  yarn: "yarn.lock",
  bun: "bun.lock"
};
function nodeSteps(node) {
  const managers = [...new Set(node.installs.map(({ manager }) => manager))];
  const [only] = managers;
  const cache = managers.length === 1 && only !== undefined && only !== "bun" ? only : undefined;
  const nested = node.installs.some(({ directory }) => directory !== ".");
  const steps = [
    ...node.yarnBerry ? ["      - run: corepack enable"] : [],
    ...managers.includes("pnpm") ? ["      - uses: pnpm/action-setup@v6"] : [],
    "      - uses: actions/setup-node@v7",
    "        with:",
    node.versionFile === undefined ? "          node-version: lts/*" : `          node-version-file: ${node.versionFile}`,
    ...cache === undefined ? [] : [`          cache: ${cache}`],
    ...cache !== undefined && nested ? [`          cache-dependency-path: ${quoted(`**/${LOCKFILE[cache]}`)}`] : [],
    ...managers.includes("bun") ? ["      - uses: oven-sh/setup-bun@v2"] : []
  ];
  const installs = node.installs.flatMap(({ directory, manager }) => [
    `      - run: ${installCommand(manager, node.yarnBerry)}`,
    ...directory === "." ? [] : [`        working-directory: ${directory}`]
  ]);
  if (installs.length === 0)
    return steps;
  return [...steps, "      # Once for every program in the repo, not once per stack.", ...installs];
}
function installCommand(manager, yarnBerry) {
  switch (manager) {
    case "npm":
      return "npm ci";
    case "pnpm":
      return "pnpm install --frozen-lockfile";
    case "yarn":
      return yarnBerry ? "yarn install --immutable" : "yarn install --frozen-lockfile";
    case "bun":
      return "bun install --frozen-lockfile";
  }
}
function pulumiSteps(findings) {
  const managers = [...new Set(findings.node?.installs.map(({ manager }) => manager) ?? [])];
  const keyFiles = managers.length > 0 ? managers.map((manager) => `'**/${LOCKFILE[manager]}'`) : ["'**/Pulumi.yaml'", "'**/Pulumi.yml'", "'**/Pulumi.json'"];
  const others = findings.otherRuntimes.flatMap(({ runtime, paths }) => [
    `      # The packages of the ${runtime} programs, with the ${runtime} the runner has.`,
    ...paths.flatMap((path) => [
      "      - run: pulumi install",
      ...path === "." ? [] : [`        working-directory: ${path}`]
    ])
  ]);
  return [
    "      - uses: pulumi/actions@v7 # without a command this only installs the CLI",
    "        with:",
    "          pulumi-version: ^3.229.0",
    "      # The providers the programs use. The first run fills the cache.",
    "      - uses: actions/cache@v6",
    "        with:",
    "          path: ~/.pulumi/plugins",
    `          key: pulumi-plugins-\${{ runner.os }}-\${{ hashFiles(${keyFiles.join(", ")}) }}`,
    ...others
  ];
}
var OPENTOFU_STEPS = [
  "      - uses: opentofu/setup-opentofu@a1320f892987e89d278cc92dc5adc984fb93aca4 # v2.0.2",
  "        with:",
  "          tofu_version: 1.12.6",
  "          tofu_wrapper: false"
];
var HELM_STEPS = [
  "      - uses: azure/setup-helm@9bc31f4ebc9c6b171d7bfbaa5d006ae7abdb4310 # v5.0.1",
  "        with:",
  "          version: v4.3.0",
  "      - name: Install the diff plugin",
  "        run: helm plugin install https://github.com/databus23/helm-diff --version v3.15.13 --verify=false"
];
var KUBECTL_STEPS = [
  "      - uses: azure/setup-kubectl@v5",
  "        with:",
  "          version: v1.37.0"
];
function helmSteps(repositories) {
  if (repositories.length === 0)
    return HELM_STEPS;
  return [
    ...HELM_STEPS,
    "      # The repositories the dependencies of the local charts come from.",
    "      - name: Add the chart repositories",
    "        run: |",
    ...repositories.map((repository, index) => `          helm repo add dependency-${index + 1} ${repository}`)
  ];
}
var TOKEN_SECRET = "OP_SERVICE_ACCOUNT_TOKEN";
function credentialSteps(envFiles) {
  if (envFiles === undefined) {
    return [
      "      # Load your credentials and your state backend settings into the job",
      "      # environment here. Sluiceway passes the environment to the tool and",
      "      # never looks inside. Whatever loads a secret must also mask it. Or",
      "      # name a file of NAME=value lines with the env-file input on the step",
      "      # below, and Sluiceway loads it for the tool and masks every value."
    ];
  }
  const file = envFiles.deploy;
  return [
    "      # Leave this out when op is part of your runner image.",
    "      - uses: 1password/install-cli-action@v4",
    "      # One `op run` resolves the whole file. These credentials preview and",
    "      # deploy, so they must be able to change things.",
    "      - name: Load the environment",
    "        env:",
    `          OP_SERVICE_ACCOUNT_TOKEN: \${{ secrets.${TOKEN_SECRET} }}`,
    `        run: op run --env-file=${file} --no-masking -- bash ${EXPORT_ENV_FILE} ${file}`
  ];
}
var HINTED = 10;
var SCHEMA = "# yaml-language-server: $schema=https://raw.githubusercontent.com/sluiceway/sluiceway/main/schema/sluiceway.schema.json";
function starterConfig({ declarable, unrelated, unclaimed }) {
  const { opentofu, helm } = declarable;
  const lines = [
    SCHEMA,
    "#",
    "# Written by sluiceway init from the files of this repo. Review it before",
    `# you commit it. Every key is explained at ${DOCS.configuration}`
  ];
  if (opentofu.length + helm.length > 0) {
    lines.push("", "stacks:");
    for (const root of opentofu) {
      const stacks = openTofuStacks(root);
      lines.push(stacks.length > 1 ? `  # An OpenTofu root module with a var file per stack, each in a workspace of its name.` : "  # An OpenTofu root module.");
      for (const { name, varFile } of stacks) {
        lines.push(`  - path: ${quotedIfNeeded(root.path)}`);
        if (name !== undefined)
          lines.push(`    name: ${quotedIfNeeded(name)}`);
        lines.push("    tool: opentofu");
        if (varFile !== undefined) {
          lines.push("    options:");
          if (name !== undefined)
            lines.push(`      workspace: ${quotedIfNeeded(name)}`);
          lines.push(`      varFiles: [${quotedIfNeeded(varFile)}]`);
        }
      }
    }
    for (const chart of helm) {
      lines.push("  # A local chart. Set the release and the namespace it runs as, and its", "  # values files: init named both after the chart.", `  - path: ${quotedIfNeeded(chart.path)}`, "    tool: helm", "    options:", `      release: ${chart.release}`, `      namespace: ${chart.release}`, "      chart: .");
    }
  }
  if (unrelated.length > 0) {
    lines.push("", "# Files that look like docs and tooling. A push that changes only these", "# previews nothing. Take out any that one of your programs reads.", "scan:", "  unrelated:", ...unrelated.map((glob) => `    - ${JSON.stringify(glob)}`));
  }
  if (unclaimed !== undefined) {
    const [first] = unclaimed.directories;
    lines.push("", "# No stack claims the files in these directories, so a push that changes", "# one of them previews every stack:", ...unclaimed.directories.slice(0, HINTED).map((directory) => `#   ${directory}/`), ...unclaimed.directories.length > HINTED ? [`#   and ${unclaimed.directories.length - HINTED} more, which the check lists`] : [], "# When a stack reads one, name it under inputs in that stack's entry:", "#", "#   stacks:", `#     - path: ${unclaimed.stack}`, "#       inputs:", `#         - "${first}/**"`);
  }
  return `${lines.join(`
`)}
`;
}
var CLI = "npx sluiceway";
var NOT_A_REPO_ROOT = "This is not the root of a git repo. Run init in the top directory of your checkout.";
function noStacksText() {
  return "init found no stack to set up: no Pulumi project, no OpenTofu root module and no Helm chart. It wrote nothing.";
}
function workflowExistsText(paths) {
  const force = paths.length === 1 && paths[0] === WORKFLOW_FILE ? `, or ${CLI} init --force to write ${WORKFLOW_FILE} again` : "";
  return `A workflow runs Sluiceway already: ${paths.join(", ")}. init never overwrites one, and wrote nothing. Run ${CLI} check to see what it lacks${force}.`;
}
function wroteText(file) {
  return `Wrote ${file}.`;
}
function replacedText(file) {
  return `Replaced ${file}.`;
}
var KEPT_CONFIG = "Kept sluiceway.yaml as it is, and set the workflow up from it.";
var NEEDS_A_PERSON = "Still to do by a person:";
function needsText({ findings, declarable, branchGuessed }) {
  const needs = [];
  const { envFiles, node } = findings;
  if (envFiles === undefined) {
    needs.push(`Load the credentials and the state backend settings of your stacks where the comment in the workflow says, with credentials that can deploy. init writes no credential step it did not find in the repo. Recipes: ${DOCS.credentials}`);
  } else {
    needs.push(`Create the secret ${TOKEN_SECRET}, a 1Password service account token that resolves ${envFiles.deploy}.`);
    const unused = [
      ...envFiles.preview === envFiles.deploy ? [] : [envFiles.preview],
      ...envFiles.others
    ];
    if (unused.length > 0) {
      needs.push(`init did not use ${unused.join(", ")}: one job previews and deploys, with the credentials of ${envFiles.deploy}. For credentials that only read in scans, use the split workflow: ${DOCS.splitWorkflow}`);
    }
  }
  if (findings.helm || findings.kubectl) {
    needs.push(`The job needs a kubeconfig for the cluster: ${[
      ...findings.helm ? [DOCS.credentialsHelm] : [],
      ...findings.kubectl ? [DOCS.credentialsKubectl] : []
    ].join(" and ")}`);
  }
  if (declarable.helm.length > 0) {
    needs.push(`sluiceway.yaml names each Helm release and its namespace after the chart: ${declarable.helm.map(({ path }) => path).join(", ")}. Set both to where the release runs, and add its values files. The namespace must exist.`);
  }
  if (findings.helmRepositories.length > 0) {
    needs.push("The workflow adds the chart repositories the local charts depend on. Log in to any that is private before that step.");
  }
  const workspaces = declarable.opentofu.filter(({ varFiles }) => varFiles.length > 1);
  if (workspaces.length > 0) {
    needs.push(`${workspaces.map(({ path }) => path).join(", ")}: one stack per var file, each in a workspace of the same name. Change workspace where yours is named otherwise.`);
  }
  if (node !== undefined && node.withoutLockfile.length > 0) {
    needs.push(`No lockfile for the Node programs in ${node.withoutLockfile.join(", ")}: add one, or install their packages in the workflow yourself.`);
  }
  if (node?.pnpmWithoutVersion) {
    needs.push("pnpm/action-setup reads the pnpm version from packageManager in package.json, which names none. Add it there, or set version on the step.");
  }
  for (const { runtime } of findings.otherRuntimes) {
    needs.push(`The ${runtime} programs run on the ${runtime} the runner has. Add its setup action before pulumi install to pin a version.`);
  }
  if (branchGuessed) {
    needs.push(`The workflow scans after a push to ${DEFAULT_BRANCH}: init could not read the default branch. Change it if yours is another.`);
  }
  needs.push(`The job runs on ${RUNS_ON} with timeout-minutes: 60. Raise it when a scan or a deploy of yours takes longer, since one run can hold both. For a self-hosted runner change runs-on, with runner 2.328.0 or newer.`, `Review the files, run ${CLI} check, and commit them. init commits nothing.`);
  return needs;
}
function quoted(text) {
  return `'${text.replaceAll("'", "''")}'`;
}
function quotedIfNeeded(text) {
  return /^[A-Za-z0-9_][\w./-]*$/.test(text) && !/^(true|false|null|yes|no|on|off|~)$/i.test(text) ? text : JSON.stringify(text);
}

// src/modes/init.ts
async function init(context) {
  const { root, log } = context;
  if (!existsSync2(join14(root, ".git")))
    throw new Error(NOT_A_REPO_ROOT);
  const configKept = hasConfigFile(root);
  const existing = loadConfig(root);
  const replace = context.force === true && exists(root, WORKFLOW_FILE);
  const running = checkWorkflows(readWorkflowFiles(root), existing).workflows.filter(({ jobs }) => jobs.some(({ runs }) => runs.some((mode) => mode !== "check" && mode !== "init"))).map(({ path }) => path).filter((path) => !(replace && path === WORKFLOW_FILE));
  const taken = [
    ...new Set([...running, ...exists(root, WORKFLOW_FILE) && !replace ? [WORKFLOW_FILE] : []])
  ];
  if (taken.length > 0)
    throw new Error(workflowExistsText(taken.sort()));
  const files = await repoFiles(root);
  const read = (file) => {
    try {
      return readFileSync10(join14(root, file), "utf8");
    } catch {
      return;
    }
  };
  const found = await context.adapter.discover(root, existing);
  const declarable = configKept ? { opentofu: [], helm: [] } : findDeclarable(files, read, found.map(({ path }) => path));
  let config = existing;
  let configText;
  let stacks = found;
  if (!configKept) {
    const declared = starterConfig({ declarable, unrelated: [], unclaimed: undefined });
    config = parseConfig(declared);
    stacks = await context.adapter.discover(root, config);
  }
  if (stacks.length === 0)
    throw new Error(noStacksText());
  const findings = findForWorkflow(stacks, files, read);
  const written = [
    WORKFLOW_FILE,
    ...configKept ? [] : [CONFIG_FILE],
    ...findings.envFiles !== undefined && !exists(root, EXPORT_ENV_FILE) ? [EXPORT_ENV_FILE] : []
  ];
  if (!configKept) {
    const report = checkSetup(config, stacks, [...new Set([...files, ...written])].sort());
    const unrelated = report.suggested;
    const covered = checkSetup(parseConfig(starterConfig({ declarable, unrelated, unclaimed: undefined })), stacks, files);
    const directories = [
      ...new Set(covered.unclaimed.flatMap(({ files: unclaimed }) => unclaimed.map((file) => dirname(file)).filter((directory) => directory !== ".")))
    ].sort();
    const [first] = directories;
    configText = starterConfig({
      declarable,
      unrelated,
      unclaimed: first === undefined ? undefined : {
        directories,
        stack: nearest(first, stacks.map(({ path }) => path))
      }
    });
    config = parseConfig(configText);
    stacks = await context.adapter.discover(root, config);
  }
  const branch = defaultBranch(root);
  const workflow = starterWorkflow({
    findings,
    branch,
    merges: config.mergeAndDeploy.authors.length > 0
  });
  write2(root, WORKFLOW_FILE, workflow, replace);
  if (configText !== undefined)
    write2(root, CONFIG_FILE, configText);
  if (written.includes(EXPORT_ENV_FILE))
    write2(root, EXPORT_ENV_FILE, EXPORT_ENV);
  log.info(foundText(stacks.length));
  log.group("Stacks", stacks.map((stack) => stackId(stack)));
  for (const file of written) {
    log.info(replace && file === WORKFLOW_FILE ? replacedText(file) : wroteText(file));
  }
  if (configKept)
    log.info(KEPT_CONFIG);
  log.group(NEEDS_A_PERSON, needsText({ findings, declarable, branchGuessed: branch === undefined }).map((need) => `- ${need}`));
}
function nearest(directory, paths) {
  const shared = (path) => {
    const a = directory.split("/");
    const b = path.split("/");
    let count = 0;
    while (count < a.length && a[count] === b[count])
      count++;
    return count;
  };
  return paths.reduce((best, path) => shared(path) > shared(best) ? path : best);
}
function exists(root, file) {
  return existsSync2(join14(root, file));
}
function write2(root, file, text, replace = false) {
  mkdirSync(dirname(join14(root, file)), { recursive: true });
  writeFileSync(join14(root, file), text, { flag: replace ? "w" : "wx" });
}
function defaultBranch(root) {
  const file = join14(root, ".git", "refs", "remotes", "origin", "HEAD");
  try {
    if (!statSync5(join14(root, ".git")).isDirectory())
      return;
    const match = /^ref: refs\/remotes\/origin\/(\S+)\s*$/.exec(readFileSync10(file, "utf8"));
    return match?.[1];
  } catch {
    return;
  }
}

// src/cli/exit.ts
var EXIT = {
  ok: 0,
  failed: 1,
  usage: 2,
  signedOut: 3,
  notFound: 4,
  refused: 5,
  later: 6
};

// src/cli/app-client.ts
class AppError extends Error {
  code;
  exit;
  problems;
  constructor(message, code, exit, problems = []) {
    super(message);
    this.code = code;
    this.exit = exit;
    this.problems = problems;
  }
}
var EXIT_OF = {
  "no-token": EXIT.signedOut,
  "token-not-working": EXIT.signedOut,
  "org-gone": EXIT.signedOut,
  "not-a-member": EXIT.signedOut,
  "not-found": EXIT.notFound,
  "no-preview": EXIT.notFound,
  "preview-unreadable": EXIT.failed,
  "rate-limited": EXIT.later,
  "github-silent": EXIT.later,
  "changes-refused": EXIT.refused
};
var TIMEOUT_MS = 30000;
function appClient(options) {
  const request = async (method, path, body) => {
    let response;
    try {
      response = await options.fetch(`${options.app}${path}`, {
        method,
        headers: {
          authorization: `Bearer ${options.token}`,
          accept: "application/json",
          "user-agent": `sluiceway/${options.version}`,
          ...body === undefined ? {} : { "content-type": "application/json" }
        },
        ...body === undefined ? {} : { body: JSON.stringify(body) },
        redirect: "error",
        signal: AbortSignal.timeout(TIMEOUT_MS)
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new AppError(`Could not reach ${options.app}: ${reason}`, "unreachable", EXIT.failed);
    }
    let answer;
    try {
      answer = await response.json();
    } catch {
      answer = undefined;
    }
    if (answer === null || typeof answer !== "object") {
      throw new AppError(`${options.app} answered ${response.status}, and not with the app's words.`, "not-the-app", EXIT.failed);
    }
    if (response.ok)
      return answer;
    const { error, code, problems } = answer;
    if (typeof error !== "string" || typeof code !== "string") {
      throw new AppError(`${options.app} answered ${response.status}, and not with the app's words.`, "not-the-app", EXIT.failed);
    }
    const retry = response.headers.get("retry-after");
    const message = code === "rate-limited" && retry !== null && /^\d+$/.test(retry) ? `${error} Try again in ${retry} seconds.` : error;
    throw new AppError(message, code, EXIT_OF[code] ?? EXIT.failed, Array.isArray(problems) ? problems.map(String) : []);
  };
  return {
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body)
  };
}

// src/cli/app-commands.ts
var POLL_MS = 2000;
var POLL_FOR_MS = 60000;
async function runAppCommand(parsed, io) {
  let ending;
  try {
    ending = await dispatch(parsed, io);
  } catch (error) {
    if (!(error instanceof AppError))
      throw error;
    ending = {
      exit: error.exit,
      lines: [],
      errors: [error.message, ...error.problems.map((problem) => `  ${problem}`)],
      json: {
        error: error.message,
        code: error.code,
        exit: error.exit,
        ...error.problems.length > 0 ? { problems: error.problems } : {}
      }
    };
  }
  if (parsed.json)
    io.out(JSON.stringify(ending.json, null, 2));
  else {
    for (const line of ending.lines)
      io.out(line);
    for (const line of ending.errors ?? [])
      io.err(line);
  }
  return ending.exit;
}
function tokensPage(app) {
  return `${app}/settings/tokens`;
}
async function dispatch(parsed, io) {
  const { app } = parsed;
  if (parsed.command === "login")
    return login(app, io);
  if (parsed.command === "logout")
    return logout(app, io);
  const token = await io.tokens.read(app);
  if (token === undefined) {
    throw new AppError(`Not signed in to ${app}. Make a token on ${tokensPage(app)}, then run sluiceway login.`, "not-signed-in", EXIT.signedOut);
  }
  const client = appClient({ app, token, version: io.version, fetch: io.fetch });
  const me = await client.get("/api/v1/me");
  const org = `/api/v1/orgs/${encodeURIComponent(me.org)}`;
  const repoPath = (repo) => `${org}/repos/${encodeURIComponent(repoName(me.org, repo))}`;
  switch (parsed.command) {
    case "status":
      return parsed.repo === undefined ? orgStatus(await client.get(org)) : repoStatus(await client.get(repoPath(parsed.repo)));
    case "stack":
      return stackRow(await client.get(`${repoPath(parsed.repo)}/stacks/${encodeURIComponent(parsed.stack)}`));
    case "preview":
      return preview(await client.get(`${repoPath(parsed.repo)}/stacks/${encodeURIComponent(parsed.stack)}/preview`));
    case "tick":
      return tick(client, repoPath(parsed.repo), parsed, io);
    case "rescan":
      return rescan(await client.post(`${repoPath(parsed.repo)}/rescan`));
    case "settings":
      return parsed.changes === undefined ? settings(await client.get(`${repoPath(parsed.repo)}/config`)) : pullRequest(await client.post(`${repoPath(parsed.repo)}/config/pull-request`, {
        changes: parsed.changes
      }));
  }
}
function repoName(org, repo) {
  const slash = repo.indexOf("/");
  if (slash === -1)
    return repo;
  if (repo.slice(0, slash).toLowerCase() !== org.toLowerCase()) {
    throw new AppError(`The token is for ${org}, and ${repo} is not in it.`, "not-found", EXIT.notFound);
  }
  return repo.slice(slash + 1);
}
async function login(app, io) {
  const token = (await io.readToken(`Paste a token from ${tokensPage(app)}: `)).trim();
  if (token === "") {
    throw new AppError(`No token was given. Make one on ${tokensPage(app)} and paste it, or pipe it in.`, "no-token", EXIT.usage);
  }
  if (!token.startsWith("sluiceway_")) {
    throw new AppError(`That is not a Sluiceway token: one starts with sluiceway_. Make one on ${tokensPage(app)}.`, "not-a-sluiceway-token", EXIT.usage);
  }
  const me = await appClient({ app, token, version: io.version, fetch: io.fetch }).get("/api/v1/me");
  const kept = await io.tokens.write(app, token);
  return {
    exit: EXIT.ok,
    lines: [
      `Signed in to ${app} as ${me.login}, for ${me.org}, with the token ${me.token.name}, which works until ${me.token.expiresAt}.`,
      `The token is kept in ${kept}.`
    ],
    json: { app, ...me, kept }
  };
}
async function logout(app, io) {
  const places = await io.tokens.remove(app);
  if (places.length === 0) {
    return {
      exit: EXIT.ok,
      lines: [`There was no token for ${app}.`],
      json: { app, removed: [] }
    };
  }
  return {
    exit: EXIT.ok,
    lines: [
      `Signed out of ${app}: the token is gone from ${places.join(" and ")}.`,
      `It still works until it expires. Revoke it on ${tokensPage(app)} to stop it now.`
    ],
    json: { app, removed: places }
  };
}
var STATES = ["pending", "deploying", "drifted", "failed", "in-sync"];
function countsWords(counts, total) {
  const parts = STATES.filter((state) => counts[state] > 0).map((state) => `${counts[state]} ${state === "in-sync" ? "in sync" : state}`);
  return [...parts, `${total} ${total === 1 ? "stack" : "stacks"}`].join(", ");
}
var GROUPS = [
  { label: "Needs you", states: ["pending", "drifted", "failed"] },
  { label: "In flight", states: ["deploying"] },
  { label: "In sync", states: ["in-sync"] }
];
function grouped(stacks, withRepo) {
  const lines = [];
  for (const group of GROUPS) {
    const states = group.states;
    const rank = (row) => states.indexOf(row.state) * 2 + (row.destroys ? 0 : 1);
    const rows = stacks.map((row, index) => ({ row, index })).filter(({ row }) => states.includes(row.state)).sort((a, b) => rank(a.row) - rank(b.row) || a.index - b.index).map(({ row }) => row);
    if (rows.length === 0)
      continue;
    lines.push(group.label);
    for (const row of rows) {
      const name = withRepo ? `${row.repo}  ${row.stack}` : row.stack;
      if (row.state === "in-sync") {
        lines.push(`  ${name}`);
        continue;
      }
      const word = row.destroys ? `${row.word}, deletes or replaces` : row.word;
      lines.push(`  ${name}  ${word}${row.line === "" ? "" : `  ${row.line}`}`);
    }
  }
  return lines;
}
function orgStatus(org) {
  const lines = [
    `${org.org.login}: ${countsWords(org.counts, org.total)}`,
    org.lastScan === null ? "No scan yet." : `Last scan: ${org.lastScan.sha.slice(0, 7)} of ${org.lastScan.repo} at ${org.lastScan.at}`,
    "",
    ...grouped(org.stacks, true)
  ];
  const writers = org.repos.filter((repo) => repo.recordWriter !== null);
  if (writers.length > 0) {
    lines.push("", ...writers.map((repo) => `${repo.name}: ${repo.recordWriter}`));
  }
  if (org.locked.length > 0 || org.allowance.sentence !== null) {
    lines.push("", ...org.locked.map((repo) => `Locked: ${repo.name} (${countsWords(repo.counts, repo.total)})`), ...org.allowance.sentence === null ? [] : [org.allowance.sentence]);
  }
  return { exit: EXIT.ok, lines, json: org };
}
function repoStatus(repo) {
  const scan = repo.scan === null ? "No scan yet." : `Last scan: ${repo.scan.sha.slice(0, 7)}${repo.scan.at === null ? "" : ` at ${repo.scan.at}`}`;
  return {
    exit: EXIT.ok,
    lines: [
      `${repo.repo.name}: ${countsWords(repo.counts, repo.total)}`,
      scan,
      ...repo.repo.dashboard === null ? [] : [`Dashboard: ${repo.repo.dashboard}`],
      ...repo.repo.recordWriter === null ? [] : [repo.repo.recordWriter],
      "",
      ...grouped(repo.stacks, false)
    ],
    json: repo
  };
}
function deployWords(deploy) {
  return `${deploy.result}, ${deploy.who}, at ${deploy.at}`;
}
function stackRow(stack) {
  const lines = [`${stack.stack} in ${stack.repo}: ${stack.word}`];
  if (stack.line !== "")
    lines.push(stack.line);
  if (stack.changes !== null)
    lines.push(`Changes: ${stack.changes}`);
  if (stack.destroys !== null)
    lines.push(`Deletes or replaces: ${stack.destroys}`);
  if (stack.drift !== null)
    lines.push(`Drift: ${stack.drift}`);
  if (stack.ticked)
    lines.push("Ticked on the dashboard.");
  if (stack.preview !== null)
    lines.push(`Preview: ${stack.preview.name}, on ${stack.preview.url}`);
  if (stack.run !== null)
    lines.push(`Run: ${stack.run}`);
  if (stack.lastDeploy !== null)
    lines.push(`Last deploy: ${deployWords(stack.lastDeploy)}`);
  lines.push(`Dashboard: ${stack.dashboard}`);
  return { exit: EXIT.ok, lines, json: stack };
}
function pathWords(change, path) {
  const value = change.values.find((one) => one.path === path);
  if (value === undefined)
    return path;
  return `${path} ${value.old ?? "nothing"} → ${value.new ?? "nothing"}`;
}
function changeWords(change) {
  const word = [change.action === "none" ? undefined : change.action, change.tracking ?? undefined].filter((part) => part !== undefined).join(" + ");
  const destroy = change.action === "delete" || change.action === "replace";
  const parts = [`${destroy ? word.toUpperCase() : word}  ${change.type}  ${change.name}`];
  const others = change.properties.filter((path) => !change.forcedBy.includes(path));
  if (change.forcedBy.length > 0) {
    parts.push(`forced by ${change.forcedBy.map((path) => pathWords(change, path)).join(", ")}`);
  }
  if (others.length > 0) {
    const listed = others.map((path) => pathWords(change, path)).join(", ");
    parts.push(change.forcedBy.length > 0 ? `also changes ${listed}` : listed);
  }
  return parts.join(" · ");
}
function preview(answer) {
  const at = answer.page.at === null ? "" : `, written at ${answer.page.at}`;
  const lines = [
    `${answer.stack} in ${answer.repo}: ${answer.title.slice(answer.title.indexOf(": ") + 2)}`,
    `Preview page: ${answer.page.url}, of ${answer.page.sha.slice(0, 7)}${at}`
  ];
  if (answer.policies.length > 0) {
    lines.push("", "Policies");
    for (const policy of answer.policies) {
      lines.push(`  ${policy.result}  ${policy.namespace} · ${policy.message}`);
    }
  }
  if (answer.changes.length > 0) {
    lines.push("", "Changes");
    for (const change of answer.changes)
      lines.push(`  ${changeWords(change)}`);
  }
  if (answer.drift.length > 0) {
    lines.push("", "Outside the code");
    for (const drift of answer.drift) {
      const paths = drift.properties.length > 0 ? ` · ${drift.properties.join(", ")}` : "";
      lines.push(`  ${drift.action}  ${drift.type}  ${drift.name}${paths}`);
    }
  }
  if (answer.unlisted > 0) {
    const are = answer.unlisted === 1 ? "change is" : "changes are";
    lines.push("", `${answer.unlisted} more ${are} not on the preview page, which GitHub limits in size: the job log of the scan lists every change.`);
  }
  if (answer.unread > 0) {
    const noun = answer.unread === 1 ? "line" : "lines";
    lines.push("", `${answer.unread} ${noun} of the preview page could not be read here: see the page itself.`);
  }
  return { exit: EXIT.ok, lines, json: answer };
}
async function tick(client, repoPath, parsed, io) {
  const stackPath = `${repoPath}/stacks/${encodeURIComponent(parsed.stack)}`;
  const stack = await client.get(stackPath);
  if (stack.destroys !== null && !parsed.yes) {
    throw new AppError(`${parsed.stack} deletes or replaces resources (${stack.destroys}). Run the tick again with --yes to deploy that.`, "needs-yes", EXIT.refused);
  }
  const answer = await client.post(`${stackPath}/tick`, parsed.yes && stack.confirm ? { confirm: stack.confirm } : undefined);
  if (answer.outcome === "unconfirmed") {
    return {
      exit: EXIT.refused,
      lines: [],
      errors: [
        answer.sentence,
        `Read it again with sluiceway stack ${parsed.repo} ${parsed.stack}, and tick it with --yes if it should still deploy.`
      ],
      json: { tick: answer, deploy: null }
    };
  }
  if (answer.outcome !== "asked" && answer.outcome !== "queued") {
    return {
      exit: answer.outcome === "failed" ? EXIT.failed : EXIT.refused,
      lines: [],
      errors: [answer.sentence],
      json: { tick: answer, deploy: null }
    };
  }
  const follow = answer.outcome === "queued" ? `The run of resolve that starts it opens a deployment record of its own and deploys it through a fresh preview and the hash check. Follow it with sluiceway stack ${parsed.repo} ${parsed.stack}, or on the dashboard: ${answer.dashboard}` : `The workflow deploys it through a fresh preview and the hash check, and the dashboard says how it went: ${answer.dashboard}`;
  if (answer.deployment === null) {
    return {
      exit: EXIT.ok,
      lines: [answer.sentence, follow],
      json: { tick: answer, deploy: null }
    };
  }
  const id = answer.deployment.id;
  const deploy = await poll(client, `${repoPath}/deployments/${id}`, io);
  if (deploy === undefined) {
    const message = `The app has not shown deployment record ${id} yet. See it with sluiceway stack ${parsed.repo} ${parsed.stack}.`;
    return {
      exit: EXIT.later,
      lines: [answer.sentence],
      errors: [message],
      json: { tick: answer, deploy: null, error: message, code: "not-shown-yet", exit: EXIT.later }
    };
  }
  const json = { tick: answer, deploy };
  if (deploy.state === "failed") {
    return {
      exit: EXIT.failed,
      lines: [
        answer.sentence,
        `Deployment record ${id}: failed.`,
        `The dashboard says why: ${answer.dashboard}`
      ],
      json
    };
  }
  const open = deploy.result === "waiting to start" || deploy.result === "deploying now";
  return {
    exit: EXIT.ok,
    lines: [
      answer.sentence,
      open ? `Deployment record ${id}: ${deploy.result}.` : `Deployment record ${id}: the app says ${deploy.result}.`,
      follow
    ],
    json
  };
}
async function poll(client, path, io) {
  for (let waited = 0;; waited += POLL_MS) {
    try {
      return await client.get(path);
    } catch (error) {
      if (!(error instanceof AppError) || error.code !== "not-found")
        throw error;
    }
    if (waited >= POLL_FOR_MS)
      return;
    await io.sleep(POLL_MS);
  }
}
function rescan(answer) {
  if (answer.outcome === "asked") {
    return {
      exit: EXIT.ok,
      lines: [answer.sentence, `Dashboard: ${answer.dashboard}`],
      json: answer
    };
  }
  return {
    exit: answer.outcome === "failed" ? EXIT.failed : EXIT.refused,
    lines: [],
    errors: [answer.sentence],
    json: answer
  };
}
function settings(config) {
  const sha = config.sha === null ? "" : ` at ${config.sha.slice(0, 7)}`;
  const head = config.file === null ? `${config.repo} has no sluiceway.yaml${sha}: every key has the action's default.` : `${config.file} of ${config.repo}${sha}: ${config.url ?? ""}`;
  return {
    exit: EXIT.ok,
    lines: [
      head,
      ...config.problem === null ? [] : [config.problem],
      ...Object.entries(config.keys).map(([key, value]) => `  ${key} = ${JSON.stringify(value)}`)
    ],
    json: config
  };
}
function pullRequest(answer) {
  const lines = [
    answer.sentence,
    ...answer.changes.map((change) => `  ${change}`),
    ...answer.url === null ? [] : [answer.url]
  ];
  switch (answer.outcome) {
    case "opened":
    case "nothing-to-change":
      return { exit: EXIT.ok, lines, json: answer };
    case "read-failed":
    case "write-failed":
      return { exit: EXIT.failed, lines: [], errors: lines, json: answer };
    default:
      return {
        exit: EXIT.refused,
        lines: [],
        errors: [...lines, ...answer.problems.map((problem) => `  ${problem}`)],
        json: answer
      };
  }
}

// src/cli/args.ts
var DEFAULT_APP = "https://console.sluiceway.dev";
var FORMER_APP = "https://app.sluiceway.dev";
var RUNNER_MODES = new Set(["scan", "resolve", "apply", "settle", "auto"]);
var APP_COMMANDS = new Set([
  "login",
  "logout",
  "status",
  "stack",
  "preview",
  "tick",
  "rescan",
  "settings"
]);
function parseArgs(argv) {
  if (argv.includes("--help") || argv.includes("-h"))
    return { command: "help" };
  if (argv.includes("--version") || argv.includes("-V"))
    return { command: "version" };
  const [name, ...rest] = argv;
  if (name === undefined)
    return { command: "usage", message: "Name a command." };
  if (RUNNER_MODES.has(name))
    return { command: "refused", mode: name };
  if (APP_COMMANDS.has(name))
    return parseAppCommand(name, rest);
  if (name !== "init" && name !== "check") {
    return { command: "usage", message: `Unknown command "${name}".` };
  }
  let force = false;
  const paths = [];
  let options = true;
  for (const arg of rest) {
    if (options && arg === "--")
      options = false;
    else if (options && name === "init" && arg === "--force")
      force = true;
    else if (options && arg.startsWith("-")) {
      return { command: "usage", message: `Unknown option "${arg}" for ${name}.` };
    } else
      paths.push(arg);
  }
  if (paths.length > 1) {
    return {
      command: "usage",
      message: `${name} takes one path, and got ${quoted2(paths)}.`
    };
  }
  const [path] = paths;
  return name === "init" ? { command: "init", force, path } : { command: "check", path };
}
function quoted2(values) {
  return values.map((value) => `"${value}"`).join(" and ");
}
function usage(message) {
  return { command: "usage", message };
}
function parseAppCommand(name, rest) {
  let app = DEFAULT_APP;
  let json = false;
  let yes = false;
  const words = [];
  let options = true;
  for (let index = 0;index < rest.length; index++) {
    const arg = rest[index] ?? "";
    if (options && arg === "--")
      options = false;
    else if (options && arg === "--json")
      json = true;
    else if (options && name === "tick" && arg === "--yes")
      yes = true;
    else if (options && (arg === "--app" || arg.startsWith("--app="))) {
      const value = arg === "--app" ? rest[++index] : arg.slice("--app=".length);
      if (value === undefined || value === "")
        return usage("--app needs an address.");
      const address = appAddress(value);
      if (address === undefined) {
        return usage(`--app must be an https address, or http on this machine, and got "${value}".`);
      }
      app = address;
    } else if (options && arg.startsWith("-")) {
      return usage(`Unknown option "${arg}" for ${name}.`);
    } else
      words.push(arg);
  }
  const shared = { app, json };
  switch (name) {
    case "login":
    case "logout":
      if (words.length > 0)
        return usage(`${name} takes no argument, and got ${quoted2(words)}.`);
      return { command: name, ...shared };
    case "status":
      if (words.length > 1) {
        return usage(`status takes one repo at most, and got ${quoted2(words)}.`);
      }
      return { command: "status", repo: words[0], ...shared };
    case "stack":
    case "preview":
    case "tick": {
      const [repo, stack, ...extra] = words;
      if (repo === undefined || stack === undefined) {
        return usage(`${name} needs a repo and a stack id.`);
      }
      if (extra.length > 0) {
        return usage(`${name} takes a repo and a stack id, and got also ${quoted2(extra)}.`);
      }
      if (name === "tick")
        return { command: "tick", repo, stack, yes, ...shared };
      return name === "preview" ? { command: "preview", repo, stack, ...shared } : { command: "stack", repo, stack, ...shared };
    }
    case "rescan": {
      const [repo, ...extra] = words;
      if (repo === undefined)
        return usage("rescan needs a repo.");
      if (extra.length > 0)
        return usage(`rescan takes one repo, and got also ${quoted2(extra)}.`);
      return { command: "rescan", repo, ...shared };
    }
    default: {
      const [repo, verb, ...pairs] = words;
      if (repo === undefined)
        return usage("settings needs a repo.");
      if (verb === undefined)
        return { command: "settings", repo, changes: undefined, ...shared };
      if (verb !== "set")
        return usage(`settings takes set after the repo, and got "${verb}".`);
      if (pairs.length === 0)
        return usage("settings set needs at least one key=value.");
      const changes = [];
      for (const pair of pairs) {
        const change = keyChange(pair);
        if (change === undefined) {
          return usage(`settings set takes key=value, and got "${pair}".`);
        }
        changes.push(change);
      }
      return { command: "settings", repo, changes, ...shared };
    }
  }
}
function appAddress(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return;
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local))
    return;
  return url.origin;
}
function keyChange(pair) {
  const from = pair.startsWith("stacks[") ? Math.max(pair.indexOf("]"), 0) : 0;
  const at = pair.indexOf("=", from);
  if (at <= 0)
    return;
  const key = pair.slice(0, at);
  const text = pair.slice(at + 1);
  try {
    return { key, value: JSON.parse(text) };
  } catch {
    return { key, value: text };
  }
}

// src/cli/terminal.ts
function refuseOldNode(version, who = "init") {
  const major = Number(version.split(".")[0]);
  if (major < 22) {
    throw new Error(`${who} needs Node 22 or newer, and this is Node ${version}.`);
  }
}
function terminalLog(write = console.log) {
  return {
    info: write,
    group(title, lines) {
      write(title);
      for (const line of lines)
        write(`  ${line}`);
    },
    warning: (message, title) => write(`${title}: ${message}`),
    writeSummary: async () => {}
  };
}

// src/cli/run.ts
var FAILED = EXIT.failed;
var USAGE = EXIT.usage;
var HELP = `Usage:
  sluiceway init [--force] [path]
      Write .github/workflows/deploy-dashboard.yml and, when there is none,
      a first sluiceway.yaml, from the stacks it finds in the repo. It never
      overwrites a file. --force writes the workflow again.
  sluiceway check [path]
      Say which stacks it finds, and whether sluiceway.yaml and the
      workflow are right.
  sluiceway --version
  sluiceway --help

Both read the files at path, or where you stand, and nothing else: no
credentials, no token, no tool, no network. scan, resolve, apply and settle
run only in the workflow.

${DOCS.init}

With the Sluiceway app, as the person whose token it is:
  sluiceway login          Paste a token from the app, or pipe it in.
  sluiceway logout
  sluiceway status [repo]  The org's stacks, or a repo's, by state.
  sluiceway stack <repo> <stack id>
                           A stack's row and its preview page.
  sluiceway preview <repo> <stack id>
                           Every change of the stack's preview, read from
                           its preview page on GitHub through the app.
  sluiceway tick <repo> <stack id> [--yes]
                           Tick it. A destroy needs --yes. Prints the
                           deployment record once it waits to start.
  sluiceway rescan <repo>  Ask GitHub for a full scan.
  sluiceway settings <repo> [set <key>=<value> ...]
                           Read the keys, or open a pull request that
                           sets them.

These call the app alone, over HTTPS, and never GitHub. --json answers in
JSON, and --app <address> names another app than ${DEFAULT_APP}.
Exit codes: 0 done, 1 failed, 2 not understood, 3 not signed in, 4 not
found, 5 refused, 6 try again later.`;
async function runCli(argv, io) {
  const parsed = parseArgs(argv);
  switch (parsed.command) {
    case "help":
      io.out(HELP);
      return 0;
    case "version":
      io.out(io.version);
      return 0;
    case "usage":
      if (argv.length === 0) {
        io.err(parsed.message);
        io.err("");
        io.err(HELP);
      } else {
        io.err(`${parsed.message} Run sluiceway --help to see the commands.`);
      }
      return USAGE;
    case "refused":
      io.err(`sluiceway ${parsed.mode} needs the run's identity and the workflow token, so it runs only in the workflow: ${DOCS.workflow}`);
      return USAGE;
    case "login":
    case "logout":
    case "status":
    case "stack":
    case "preview":
    case "tick":
    case "rescan":
    case "settings":
      return runAppCommand(parsed, io);
  }
  const log = terminalLog(io.out);
  try {
    refuseOldNode(io.nodeVersion, "sluiceway");
    const root = resolve2(io.cwd, parsed.path ?? ".");
    if (!isDirectory2(root))
      throw new Error(`There is no directory at ${root}.`);
    if (parsed.command === "init") {
      await init({ root, adapter: { discover: discoverAll }, log, force: parsed.force });
    } else {
      await check({ root, adapter: filesOnly, log });
    }
    return 0;
  } catch (error) {
    io.err(error instanceof Error ? error.message : String(error));
    return FAILED;
  }
}
function isDirectory2(path) {
  try {
    return statSync6(path).isDirectory();
  } catch {
    return false;
  }
}

// src/cli/token-store.ts
import { chmodSync, mkdirSync as mkdirSync2, readFileSync as readFileSync11, rmSync, writeFileSync as writeFileSync2 } from "node:fs";
import { join as join15 } from "node:path";
var SERVICE = "sluiceway";
function filePlace(configDir) {
  const dir = join15(configDir, "sluiceway");
  const file = join15(dir, "tokens.json");
  const load = () => {
    try {
      const parsed = JSON.parse(readFileSync11(file, "utf8"));
      return parsed !== null && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };
  const save = (tokens) => {
    if (Object.keys(tokens).length === 0) {
      rmSync(file, { force: true });
      return;
    }
    mkdirSync2(dir, { recursive: true, mode: 448 });
    chmodSync(dir, 448);
    writeFileSync2(file, `${JSON.stringify(tokens, null, 2)}
`, { mode: 384 });
    chmodSync(file, 384);
  };
  return {
    where: file,
    read: (app) => {
      const token = load()[app];
      return typeof token === "string" ? token : undefined;
    },
    write: (app, token) => {
      save({ ...load(), [app]: token });
      return true;
    },
    remove: (app) => {
      const tokens = load();
      if (!(app in tokens))
        return false;
      delete tokens[app];
      save(tokens);
      return true;
    }
  };
}
function macKeychain(run) {
  const read = (app) => {
    const found = run("security", ["find-generic-password", "-a", app, "-s", SERVICE, "-w"]);
    return found?.code === 0 ? found.stdout.replace(/\n$/, "") : undefined;
  };
  return {
    where: "the macOS keychain",
    read,
    write: (app, token) => {
      const line = `add-generic-password -U -a "${app}" -s "${SERVICE}" -l "Sluiceway" -w "${token}"
`;
      run("security", ["-i"], line);
      return read(app) === token;
    },
    remove: (app) => run("security", ["delete-generic-password", "-a", app, "-s", SERVICE])?.code === 0
  };
}
function secretService(run) {
  const attributes = (app) => ["service", SERVICE, "app", app];
  const read = (app) => {
    const found = run("secret-tool", ["lookup", ...attributes(app)]);
    return found?.code === 0 && found.stdout !== "" ? found.stdout.replace(/\n$/, "") : undefined;
  };
  return {
    where: "the Secret Service keyring",
    read,
    write: (app, token) => {
      run("secret-tool", ["store", "--label=Sluiceway", ...attributes(app)], token);
      return read(app) === token;
    },
    remove: (app) => run("secret-tool", ["clear", ...attributes(app)])?.code === 0
  };
}
function tokenStore(options) {
  const file = filePlace(options.configDir);
  const keychain = options.platform === "darwin" ? macKeychain(options.run) : options.platform === "linux" ? secretService(options.run) : undefined;
  const places = keychain === undefined ? [file] : [keychain, file];
  const readAt = (app) => {
    for (const place of places) {
      const token = place.read(app);
      if (token !== undefined)
        return token;
    }
    return;
  };
  const removeAt = (app) => places.filter((place) => place.remove(app)).map((place) => place.where);
  const addresses = (app) => app === DEFAULT_APP ? [app, FORMER_APP] : [app];
  return {
    read: async (app) => {
      for (const address of addresses(app)) {
        const token = readAt(address);
        if (token !== undefined)
          return token;
      }
      return;
    },
    write: async (app, token) => {
      let where;
      if (keychain?.write(app, token)) {
        file.remove(app);
        where = keychain.where;
      } else {
        file.write(app, token);
        where = file.where;
      }
      for (const address of addresses(app).slice(1))
        removeAt(address);
      return where;
    },
    remove: async (app) => [...new Set(addresses(app).flatMap(removeAt))]
  };
}

// src/cli.ts
function packageVersion() {
  if (typeof SLUICEWAY_VERSION === "string")
    return SLUICEWAY_VERSION;
  try {
    const file = fileURLToPath(new URL("../package.json", import.meta.url));
    return String(JSON.parse(readFileSync12(file, "utf8")).version);
  } catch {
    return "unknown";
  }
}
function configDir() {
  if (process.platform === "win32") {
    return process.env.APPDATA ?? join16(homedir(), "AppData", "Roaming");
  }
  const xdg = process.env.XDG_CONFIG_HOME;
  return xdg !== undefined && xdg !== "" ? xdg : join16(homedir(), ".config");
}
var run = (command, args, input) => {
  const result = spawnSync(command, args, {
    input: input ?? "",
    encoding: "utf8",
    stdio: ["pipe", "pipe", "ignore"],
    timeout: 1e4
  });
  if (result.error !== undefined || result.status === null)
    return;
  return { code: result.status, stdout: result.stdout };
};
async function readToken(prompt) {
  const stdin = process.stdin;
  if (!stdin.isTTY) {
    const chunks = [];
    for await (const chunk of stdin)
      chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks).toString("utf8");
  }
  process.stderr.write(prompt);
  stdin.setRawMode(true);
  stdin.setEncoding("utf8");
  stdin.resume();
  return new Promise((resolve, reject) => {
    let typed = "";
    const done = (error) => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
      process.stderr.write(`
`);
      if (error === undefined)
        resolve(typed);
      else
        reject(error);
    };
    const onData = (data) => {
      for (const char of data) {
        if (char === "\r" || char === `
` || char === "\x04")
          return done();
        if (char === "\x03")
          return done(new Error("Stopped."));
        if (char === "" || char === "\b")
          typed = typed.slice(0, -1);
        else
          typed += char;
      }
    };
    stdin.on("data", onData);
  });
}
process.exitCode = await runCli(process.argv.slice(2), {
  cwd: process.cwd(),
  version: packageVersion(),
  nodeVersion: process.versions.node,
  out: (line) => console.log(line),
  err: (line) => console.error(line),
  fetch: globalThis.fetch,
  tokens: tokenStore({ platform: process.platform, configDir: configDir(), run }),
  readToken,
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms))
});
