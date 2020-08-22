["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/disposable/disposable.js"],"~:js","goog.provide(\"goog.Disposable\");\ngoog.provide(\"goog.dispose\");\ngoog.provide(\"goog.disposeAll\");\ngoog.require(\"goog.disposable.IDisposable\");\n/**\n * @constructor\n * @implements {goog.disposable.IDisposable}\n */\ngoog.Disposable = function() {\n  /** @type {(string|undefined)} */ this.creationStack;\n  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\n    if (goog.Disposable.INCLUDE_STACK_ON_CREATION) {\n      this.creationStack = (new Error).stack;\n    }\n    goog.Disposable.instances_[goog.getUid(this)] = this;\n  }\n  this.disposed_ = this.disposed_;\n  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;\n};\n/** @enum {number} */ goog.Disposable.MonitoringMode = {OFF:0, PERMANENT:1, INTERACTIVE:2};\n/** @define {number} */ goog.define(\"goog.Disposable.MONITORING_MODE\", 0);\n/** @define {boolean} */ goog.define(\"goog.Disposable.INCLUDE_STACK_ON_CREATION\", true);\n/** @private @type {!Object<number,!goog.Disposable>} */ goog.Disposable.instances_ = {};\n/**\n * @return {!Array<!goog.Disposable>}\n */\ngoog.Disposable.getUndisposedObjects = function() {\n  var ret = [];\n  for (var id in goog.Disposable.instances_) {\n    if (goog.Disposable.instances_.hasOwnProperty(id)) {\n      ret.push(goog.Disposable.instances_[Number(id)]);\n    }\n  }\n  return ret;\n};\ngoog.Disposable.clearUndisposedObjects = function() {\n  goog.Disposable.instances_ = {};\n};\n/** @private @type {boolean} */ goog.Disposable.prototype.disposed_ = false;\n/** @private @type {Array<!Function>} */ goog.Disposable.prototype.onDisposeCallbacks_;\n/**\n * @return {boolean}\n * @override\n */\ngoog.Disposable.prototype.isDisposed = function() {\n  return this.disposed_;\n};\n/**\n * @return {boolean}\n * @deprecated Use {@link #isDisposed} instead.\n */\ngoog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;\n/**\n * @return {void}\n * @override\n */\ngoog.Disposable.prototype.dispose = function() {\n  if (!this.disposed_) {\n    this.disposed_ = true;\n    this.disposeInternal();\n    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\n      var uid = goog.getUid(this);\n      if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(uid)) {\n        throw new Error(this + \" did not call the goog.Disposable base \" + \"constructor or was disposed of after a clearUndisposedObjects \" + \"call\");\n      }\n      if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && this.onDisposeCallbacks_ && this.onDisposeCallbacks_.length > 0) {\n        throw new Error(this + \" did not empty its onDisposeCallbacks queue. This \" + \"probably means it overrode dispose() or disposeInternal() \" + \"without calling the superclass' method.\");\n      }\n      delete goog.Disposable.instances_[uid];\n    }\n  }\n};\n/**\n * @param {goog.disposable.IDisposable} disposable\n */\ngoog.Disposable.prototype.registerDisposable = function(disposable) {\n  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));\n};\n/**\n * @param {function(this:T):?} callback\n * @param {T=} opt_scope\n * @template T\n */\ngoog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {\n  if (this.disposed_) {\n    goog.isDef(opt_scope) ? callback.call(opt_scope) : callback();\n    return;\n  }\n  if (!this.onDisposeCallbacks_) {\n    this.onDisposeCallbacks_ = [];\n  }\n  this.onDisposeCallbacks_.push(goog.isDef(opt_scope) ? goog.bind(callback, opt_scope) : callback);\n};\n/** @protected */ goog.Disposable.prototype.disposeInternal = function() {\n  if (this.onDisposeCallbacks_) {\n    while (this.onDisposeCallbacks_.length) {\n      this.onDisposeCallbacks_.shift()();\n    }\n  }\n};\n/**\n * @param {*} obj\n * @return {boolean}\n */\ngoog.Disposable.isDisposed = function(obj) {\n  if (obj && typeof obj.isDisposed == \"function\") {\n    return obj.isDisposed();\n  }\n  return false;\n};\n/**\n * @param {*} obj\n */\ngoog.dispose = function(obj) {\n  if (obj && typeof obj.dispose == \"function\") {\n    obj.dispose();\n  }\n};\n/**\n * @param {...*} var_args\n */\ngoog.disposeAll = function(var_args) {\n  for (var i = 0, len = arguments.length; i < len; ++i) {\n    var disposable = arguments[i];\n    if (goog.isArrayLike(disposable)) {\n      goog.disposeAll.apply(null, disposable);\n    } else {\n      goog.dispose(disposable);\n    }\n  }\n};\n","~:source","// Copyright 2005 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\n/**\n * @fileoverview Implements the disposable interface. The dispose method is used\n * to clean up references and resources.\n * @author arv@google.com (Erik Arvidsson)\n */\n\n\ngoog.provide('goog.Disposable');\ngoog.provide('goog.dispose');\ngoog.provide('goog.disposeAll');\n\ngoog.require('goog.disposable.IDisposable');\n\n\n\n/**\n * Class that provides the basic implementation for disposable objects. If your\n * class holds one or more references to COM objects, DOM nodes, or other\n * disposable objects, it should extend this class or implement the disposable\n * interface (defined in goog.disposable.IDisposable).\n * @constructor\n * @implements {goog.disposable.IDisposable}\n */\ngoog.Disposable = function() {\n  /**\n   * If monitoring the goog.Disposable instances is enabled, stores the creation\n   * stack trace of the Disposable instance.\n   * @type {string|undefined}\n   */\n  this.creationStack;\n\n  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\n    if (goog.Disposable.INCLUDE_STACK_ON_CREATION) {\n      this.creationStack = new Error().stack;\n    }\n    goog.Disposable.instances_[goog.getUid(this)] = this;\n  }\n  // Support sealing\n  this.disposed_ = this.disposed_;\n  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;\n};\n\n\n/**\n * @enum {number} Different monitoring modes for Disposable.\n */\ngoog.Disposable.MonitoringMode = {\n  /**\n   * No monitoring.\n   */\n  OFF: 0,\n  /**\n   * Creating and disposing the goog.Disposable instances is monitored. All\n   * disposable objects need to call the `goog.Disposable` base\n   * constructor. The PERMANENT mode must be switched on before creating any\n   * goog.Disposable instances.\n   */\n  PERMANENT: 1,\n  /**\n   * INTERACTIVE mode can be switched on and off on the fly without producing\n   * errors. It also doesn't warn if the disposable objects don't call the\n   * `goog.Disposable` base constructor.\n   */\n  INTERACTIVE: 2\n};\n\n\n/**\n * @define {number} The monitoring mode of the goog.Disposable\n *     instances. Default is OFF. Switching on the monitoring is only\n *     recommended for debugging because it has a significant impact on\n *     performance and memory usage. If switched off, the monitoring code\n *     compiles down to 0 bytes.\n */\ngoog.define('goog.Disposable.MONITORING_MODE', 0);\n\n\n/**\n * @define {boolean} Whether to attach creation stack to each created disposable\n *     instance; This is only relevant for when MonitoringMode != OFF.\n */\ngoog.define('goog.Disposable.INCLUDE_STACK_ON_CREATION', true);\n\n\n/**\n * Maps the unique ID of every undisposed `goog.Disposable` object to\n * the object itself.\n * @type {!Object<number, !goog.Disposable>}\n * @private\n */\ngoog.Disposable.instances_ = {};\n\n\n/**\n * @return {!Array<!goog.Disposable>} All `goog.Disposable` objects that\n *     haven't been disposed of.\n */\ngoog.Disposable.getUndisposedObjects = function() {\n  var ret = [];\n  for (var id in goog.Disposable.instances_) {\n    if (goog.Disposable.instances_.hasOwnProperty(id)) {\n      ret.push(goog.Disposable.instances_[Number(id)]);\n    }\n  }\n  return ret;\n};\n\n\n/**\n * Clears the registry of undisposed objects but doesn't dispose of them.\n */\ngoog.Disposable.clearUndisposedObjects = function() {\n  goog.Disposable.instances_ = {};\n};\n\n\n/**\n * Whether the object has been disposed of.\n * @type {boolean}\n * @private\n */\ngoog.Disposable.prototype.disposed_ = false;\n\n\n/**\n * Callbacks to invoke when this object is disposed.\n * @type {Array<!Function>}\n * @private\n */\ngoog.Disposable.prototype.onDisposeCallbacks_;\n\n\n/**\n * @return {boolean} Whether the object has been disposed of.\n * @override\n */\ngoog.Disposable.prototype.isDisposed = function() {\n  return this.disposed_;\n};\n\n\n/**\n * @return {boolean} Whether the object has been disposed of.\n * @deprecated Use {@link #isDisposed} instead.\n */\ngoog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;\n\n\n/**\n * Disposes of the object. If the object hasn't already been disposed of, calls\n * {@link #disposeInternal}. Classes that extend `goog.Disposable` should\n * override {@link #disposeInternal} in order to delete references to COM\n * objects, DOM nodes, and other disposable objects. Reentrant.\n *\n * @return {void} Nothing.\n * @override\n */\ngoog.Disposable.prototype.dispose = function() {\n  if (!this.disposed_) {\n    // Set disposed_ to true first, in case during the chain of disposal this\n    // gets disposed recursively.\n    this.disposed_ = true;\n    this.disposeInternal();\n    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\n      var uid = goog.getUid(this);\n      if (goog.Disposable.MONITORING_MODE ==\n              goog.Disposable.MonitoringMode.PERMANENT &&\n          !goog.Disposable.instances_.hasOwnProperty(uid)) {\n        throw new Error(\n            this + ' did not call the goog.Disposable base ' +\n            'constructor or was disposed of after a clearUndisposedObjects ' +\n            'call');\n      }\n      if (goog.Disposable.MONITORING_MODE !=\n              goog.Disposable.MonitoringMode.OFF &&\n          this.onDisposeCallbacks_ && this.onDisposeCallbacks_.length > 0) {\n        throw new Error(\n            this + ' did not empty its onDisposeCallbacks queue. This ' +\n            'probably means it overrode dispose() or disposeInternal() ' +\n            'without calling the superclass\\' method.');\n      }\n      delete goog.Disposable.instances_[uid];\n    }\n  }\n};\n\n\n/**\n * Associates a disposable object with this object so that they will be disposed\n * together.\n * @param {goog.disposable.IDisposable} disposable that will be disposed when\n *     this object is disposed.\n */\ngoog.Disposable.prototype.registerDisposable = function(disposable) {\n  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));\n};\n\n\n/**\n * Invokes a callback function when this object is disposed. Callbacks are\n * invoked in the order in which they were added. If a callback is added to\n * an already disposed Disposable, it will be called immediately.\n * @param {function(this:T):?} callback The callback function.\n * @param {T=} opt_scope An optional scope to call the callback in.\n * @template T\n */\ngoog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {\n  if (this.disposed_) {\n    goog.isDef(opt_scope) ? callback.call(opt_scope) : callback();\n    return;\n  }\n  if (!this.onDisposeCallbacks_) {\n    this.onDisposeCallbacks_ = [];\n  }\n\n  this.onDisposeCallbacks_.push(\n      goog.isDef(opt_scope) ? goog.bind(callback, opt_scope) : callback);\n};\n\n\n/**\n * Deletes or nulls out any references to COM objects, DOM nodes, or other\n * disposable objects. Classes that extend `goog.Disposable` should\n * override this method.\n * Not reentrant. To avoid calling it twice, it must only be called from the\n * subclass' `disposeInternal` method. Everywhere else the public\n * `dispose` method must be used.\n * For example:\n * <pre>\n *   mypackage.MyClass = function() {\n *     mypackage.MyClass.base(this, 'constructor');\n *     // Constructor logic specific to MyClass.\n *     ...\n *   };\n *   goog.inherits(mypackage.MyClass, goog.Disposable);\n *\n *   mypackage.MyClass.prototype.disposeInternal = function() {\n *     // Dispose logic specific to MyClass.\n *     ...\n *     // Call superclass's disposeInternal at the end of the subclass's, like\n *     // in C++, to avoid hard-to-catch issues.\n *     mypackage.MyClass.base(this, 'disposeInternal');\n *   };\n * </pre>\n * @protected\n */\ngoog.Disposable.prototype.disposeInternal = function() {\n  if (this.onDisposeCallbacks_) {\n    while (this.onDisposeCallbacks_.length) {\n      this.onDisposeCallbacks_.shift()();\n    }\n  }\n};\n\n\n/**\n * Returns True if we can verify the object is disposed.\n * Calls `isDisposed` on the argument if it supports it.  If obj\n * is not an object with an isDisposed() method, return false.\n * @param {*} obj The object to investigate.\n * @return {boolean} True if we can verify the object is disposed.\n */\ngoog.Disposable.isDisposed = function(obj) {\n  if (obj && typeof obj.isDisposed == 'function') {\n    return obj.isDisposed();\n  }\n  return false;\n};\n\n\n/**\n * Calls `dispose` on the argument if it supports it. If obj is not an\n *     object with a dispose() method, this is a no-op.\n * @param {*} obj The object to dispose of.\n */\ngoog.dispose = function(obj) {\n  if (obj && typeof obj.dispose == 'function') {\n    obj.dispose();\n  }\n};\n\n\n/**\n * Calls `dispose` on each member of the list that supports it. (If the\n * member is an ArrayLike, then `goog.disposeAll()` will be called\n * recursively on each of its members.) If the member is not an object with a\n * `dispose()` method, then it is ignored.\n * @param {...*} var_args The list.\n */\ngoog.disposeAll = function(var_args) {\n  for (var i = 0, len = arguments.length; i < len; ++i) {\n    var disposable = arguments[i];\n    if (goog.isArrayLike(disposable)) {\n      goog.disposeAll.apply(null, disposable);\n    } else {\n      goog.dispose(disposable);\n    }\n  }\n};\n","~:compiled-at",1597886896309,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.disposable.disposable.js\",\n\"lineCount\":132,\n\"mappings\":\"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\",\n\"sources\":[\"goog/disposable/disposable.js\"],\n\"sourcesContent\":[\"// Copyright 2005 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\n/**\\n * @fileoverview Implements the disposable interface. The dispose method is used\\n * to clean up references and resources.\\n * @author arv@google.com (Erik Arvidsson)\\n */\\n\\n\\ngoog.provide('goog.Disposable');\\ngoog.provide('goog.dispose');\\ngoog.provide('goog.disposeAll');\\n\\ngoog.require('goog.disposable.IDisposable');\\n\\n\\n\\n/**\\n * Class that provides the basic implementation for disposable objects. If your\\n * class holds one or more references to COM objects, DOM nodes, or other\\n * disposable objects, it should extend this class or implement the disposable\\n * interface (defined in goog.disposable.IDisposable).\\n * @constructor\\n * @implements {goog.disposable.IDisposable}\\n */\\ngoog.Disposable = function() {\\n  /**\\n   * If monitoring the goog.Disposable instances is enabled, stores the creation\\n   * stack trace of the Disposable instance.\\n   * @type {string|undefined}\\n   */\\n  this.creationStack;\\n\\n  if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\\n    if (goog.Disposable.INCLUDE_STACK_ON_CREATION) {\\n      this.creationStack = new Error().stack;\\n    }\\n    goog.Disposable.instances_[goog.getUid(this)] = this;\\n  }\\n  // Support sealing\\n  this.disposed_ = this.disposed_;\\n  this.onDisposeCallbacks_ = this.onDisposeCallbacks_;\\n};\\n\\n\\n/**\\n * @enum {number} Different monitoring modes for Disposable.\\n */\\ngoog.Disposable.MonitoringMode = {\\n  /**\\n   * No monitoring.\\n   */\\n  OFF: 0,\\n  /**\\n   * Creating and disposing the goog.Disposable instances is monitored. All\\n   * disposable objects need to call the `goog.Disposable` base\\n   * constructor. The PERMANENT mode must be switched on before creating any\\n   * goog.Disposable instances.\\n   */\\n  PERMANENT: 1,\\n  /**\\n   * INTERACTIVE mode can be switched on and off on the fly without producing\\n   * errors. It also doesn't warn if the disposable objects don't call the\\n   * `goog.Disposable` base constructor.\\n   */\\n  INTERACTIVE: 2\\n};\\n\\n\\n/**\\n * @define {number} The monitoring mode of the goog.Disposable\\n *     instances. Default is OFF. Switching on the monitoring is only\\n *     recommended for debugging because it has a significant impact on\\n *     performance and memory usage. If switched off, the monitoring code\\n *     compiles down to 0 bytes.\\n */\\ngoog.define('goog.Disposable.MONITORING_MODE', 0);\\n\\n\\n/**\\n * @define {boolean} Whether to attach creation stack to each created disposable\\n *     instance; This is only relevant for when MonitoringMode != OFF.\\n */\\ngoog.define('goog.Disposable.INCLUDE_STACK_ON_CREATION', true);\\n\\n\\n/**\\n * Maps the unique ID of every undisposed `goog.Disposable` object to\\n * the object itself.\\n * @type {!Object<number, !goog.Disposable>}\\n * @private\\n */\\ngoog.Disposable.instances_ = {};\\n\\n\\n/**\\n * @return {!Array<!goog.Disposable>} All `goog.Disposable` objects that\\n *     haven't been disposed of.\\n */\\ngoog.Disposable.getUndisposedObjects = function() {\\n  var ret = [];\\n  for (var id in goog.Disposable.instances_) {\\n    if (goog.Disposable.instances_.hasOwnProperty(id)) {\\n      ret.push(goog.Disposable.instances_[Number(id)]);\\n    }\\n  }\\n  return ret;\\n};\\n\\n\\n/**\\n * Clears the registry of undisposed objects but doesn't dispose of them.\\n */\\ngoog.Disposable.clearUndisposedObjects = function() {\\n  goog.Disposable.instances_ = {};\\n};\\n\\n\\n/**\\n * Whether the object has been disposed of.\\n * @type {boolean}\\n * @private\\n */\\ngoog.Disposable.prototype.disposed_ = false;\\n\\n\\n/**\\n * Callbacks to invoke when this object is disposed.\\n * @type {Array<!Function>}\\n * @private\\n */\\ngoog.Disposable.prototype.onDisposeCallbacks_;\\n\\n\\n/**\\n * @return {boolean} Whether the object has been disposed of.\\n * @override\\n */\\ngoog.Disposable.prototype.isDisposed = function() {\\n  return this.disposed_;\\n};\\n\\n\\n/**\\n * @return {boolean} Whether the object has been disposed of.\\n * @deprecated Use {@link #isDisposed} instead.\\n */\\ngoog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;\\n\\n\\n/**\\n * Disposes of the object. If the object hasn't already been disposed of, calls\\n * {@link #disposeInternal}. Classes that extend `goog.Disposable` should\\n * override {@link #disposeInternal} in order to delete references to COM\\n * objects, DOM nodes, and other disposable objects. Reentrant.\\n *\\n * @return {void} Nothing.\\n * @override\\n */\\ngoog.Disposable.prototype.dispose = function() {\\n  if (!this.disposed_) {\\n    // Set disposed_ to true first, in case during the chain of disposal this\\n    // gets disposed recursively.\\n    this.disposed_ = true;\\n    this.disposeInternal();\\n    if (goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF) {\\n      var uid = goog.getUid(this);\\n      if (goog.Disposable.MONITORING_MODE ==\\n              goog.Disposable.MonitoringMode.PERMANENT &&\\n          !goog.Disposable.instances_.hasOwnProperty(uid)) {\\n        throw new Error(\\n            this + ' did not call the goog.Disposable base ' +\\n            'constructor or was disposed of after a clearUndisposedObjects ' +\\n            'call');\\n      }\\n      if (goog.Disposable.MONITORING_MODE !=\\n              goog.Disposable.MonitoringMode.OFF &&\\n          this.onDisposeCallbacks_ && this.onDisposeCallbacks_.length > 0) {\\n        throw new Error(\\n            this + ' did not empty its onDisposeCallbacks queue. This ' +\\n            'probably means it overrode dispose() or disposeInternal() ' +\\n            'without calling the superclass\\\\' method.');\\n      }\\n      delete goog.Disposable.instances_[uid];\\n    }\\n  }\\n};\\n\\n\\n/**\\n * Associates a disposable object with this object so that they will be disposed\\n * together.\\n * @param {goog.disposable.IDisposable} disposable that will be disposed when\\n *     this object is disposed.\\n */\\ngoog.Disposable.prototype.registerDisposable = function(disposable) {\\n  this.addOnDisposeCallback(goog.partial(goog.dispose, disposable));\\n};\\n\\n\\n/**\\n * Invokes a callback function when this object is disposed. Callbacks are\\n * invoked in the order in which they were added. If a callback is added to\\n * an already disposed Disposable, it will be called immediately.\\n * @param {function(this:T):?} callback The callback function.\\n * @param {T=} opt_scope An optional scope to call the callback in.\\n * @template T\\n */\\ngoog.Disposable.prototype.addOnDisposeCallback = function(callback, opt_scope) {\\n  if (this.disposed_) {\\n    goog.isDef(opt_scope) ? callback.call(opt_scope) : callback();\\n    return;\\n  }\\n  if (!this.onDisposeCallbacks_) {\\n    this.onDisposeCallbacks_ = [];\\n  }\\n\\n  this.onDisposeCallbacks_.push(\\n      goog.isDef(opt_scope) ? goog.bind(callback, opt_scope) : callback);\\n};\\n\\n\\n/**\\n * Deletes or nulls out any references to COM objects, DOM nodes, or other\\n * disposable objects. Classes that extend `goog.Disposable` should\\n * override this method.\\n * Not reentrant. To avoid calling it twice, it must only be called from the\\n * subclass' `disposeInternal` method. Everywhere else the public\\n * `dispose` method must be used.\\n * For example:\\n * <pre>\\n *   mypackage.MyClass = function() {\\n *     mypackage.MyClass.base(this, 'constructor');\\n *     // Constructor logic specific to MyClass.\\n *     ...\\n *   };\\n *   goog.inherits(mypackage.MyClass, goog.Disposable);\\n *\\n *   mypackage.MyClass.prototype.disposeInternal = function() {\\n *     // Dispose logic specific to MyClass.\\n *     ...\\n *     // Call superclass's disposeInternal at the end of the subclass's, like\\n *     // in C++, to avoid hard-to-catch issues.\\n *     mypackage.MyClass.base(this, 'disposeInternal');\\n *   };\\n * </pre>\\n * @protected\\n */\\ngoog.Disposable.prototype.disposeInternal = function() {\\n  if (this.onDisposeCallbacks_) {\\n    while (this.onDisposeCallbacks_.length) {\\n      this.onDisposeCallbacks_.shift()();\\n    }\\n  }\\n};\\n\\n\\n/**\\n * Returns True if we can verify the object is disposed.\\n * Calls `isDisposed` on the argument if it supports it.  If obj\\n * is not an object with an isDisposed() method, return false.\\n * @param {*} obj The object to investigate.\\n * @return {boolean} True if we can verify the object is disposed.\\n */\\ngoog.Disposable.isDisposed = function(obj) {\\n  if (obj && typeof obj.isDisposed == 'function') {\\n    return obj.isDisposed();\\n  }\\n  return false;\\n};\\n\\n\\n/**\\n * Calls `dispose` on the argument if it supports it. If obj is not an\\n *     object with a dispose() method, this is a no-op.\\n * @param {*} obj The object to dispose of.\\n */\\ngoog.dispose = function(obj) {\\n  if (obj && typeof obj.dispose == 'function') {\\n    obj.dispose();\\n  }\\n};\\n\\n\\n/**\\n * Calls `dispose` on each member of the list that supports it. (If the\\n * member is an ArrayLike, then `goog.disposeAll()` will be called\\n * recursively on each of its members.) If the member is not an object with a\\n * `dispose()` method, then it is ignored.\\n * @param {...*} var_args The list.\\n */\\ngoog.disposeAll = function(var_args) {\\n  for (var i = 0, len = arguments.length; i < len; ++i) {\\n    var disposable = arguments[i];\\n    if (goog.isArrayLike(disposable)) {\\n      goog.disposeAll.apply(null, disposable);\\n    } else {\\n      goog.dispose(disposable);\\n    }\\n  }\\n};\\n\"],\n\"names\":[\"goog\",\"provide\",\"require\",\"Disposable\",\"goog.Disposable\",\"creationStack\",\"MONITORING_MODE\",\"MonitoringMode\",\"OFF\",\"INCLUDE_STACK_ON_CREATION\",\"stack\",\"Error\",\"instances_\",\"getUid\",\"disposed_\",\"onDisposeCallbacks_\",\"PERMANENT\",\"INTERACTIVE\",\"define\",\"getUndisposedObjects\",\"goog.Disposable.getUndisposedObjects\",\"ret\",\"id\",\"hasOwnProperty\",\"push\",\"Number\",\"clearUndisposedObjects\",\"goog.Disposable.clearUndisposedObjects\",\"prototype\",\"isDisposed\",\"goog.Disposable.prototype.isDisposed\",\"getDisposed\",\"dispose\",\"goog.Disposable.prototype.dispose\",\"disposeInternal\",\"uid\",\"length\",\"registerDisposable\",\"goog.Disposable.prototype.registerDisposable\",\"disposable\",\"addOnDisposeCallback\",\"partial\",\"goog.Disposable.prototype.addOnDisposeCallback\",\"callback\",\"opt_scope\",\"isDef\",\"call\",\"bind\",\"goog.Disposable.prototype.disposeInternal\",\"shift\",\"goog.Disposable.isDisposed\",\"obj\",\"goog.dispose\",\"disposeAll\",\"goog.disposeAll\",\"var_args\",\"i\",\"len\",\"arguments\",\"isArrayLike\",\"apply\"]\n}\n"]