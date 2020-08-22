["^ ","~:resource-id",["~:shadow.build.classpath/resource","goog/promise/resolver.js"],"~:js","goog.provide(\"goog.promise.Resolver\");\ngoog.forwardDeclare(\"goog.Promise\");\n/**\n * @interface\n * @template TYPE\n */\ngoog.promise.Resolver = function() {\n};\n/** @type {!goog.Promise<TYPE>} */ goog.promise.Resolver.prototype.promise;\n/** @type {function((TYPE|goog.Promise<TYPE>|Thenable)=)} */ goog.promise.Resolver.prototype.resolve;\n/** @type {function(*=):void} */ goog.promise.Resolver.prototype.reject;\n","~:source","// Copyright 2013 The Closure Library Authors. All Rights Reserved.\n//\n// Licensed under the Apache License, Version 2.0 (the \"License\");\n// you may not use this file except in compliance with the License.\n// You may obtain a copy of the License at\n//\n//      http://www.apache.org/licenses/LICENSE-2.0\n//\n// Unless required by applicable law or agreed to in writing, software\n// distributed under the License is distributed on an \"AS-IS\" BASIS,\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n// See the License for the specific language governing permissions and\n// limitations under the License.\n\ngoog.provide('goog.promise.Resolver');\n\ngoog.forwardDeclare('goog.Promise');\n\n\n\n/**\n * Resolver interface for promises. The resolver is a convenience interface that\n * bundles the promise and its associated resolve and reject functions together,\n * for cases where the resolver needs to be persisted internally.\n *\n * @interface\n * @template TYPE\n */\ngoog.promise.Resolver = function() {};\n\n\n/**\n * The promise that created this resolver.\n * @type {!goog.Promise<TYPE>}\n */\ngoog.promise.Resolver.prototype.promise;\n\n\n/**\n * Resolves this resolver with the specified value.\n * @type {function((TYPE|goog.Promise<TYPE>|Thenable)=)}\n */\ngoog.promise.Resolver.prototype.resolve;\n\n\n/**\n * Rejects this resolver with the specified reason.\n * @type {function(*=): void}\n */\ngoog.promise.Resolver.prototype.reject;\n","~:compiled-at",1597886896329,"~:source-map-json","{\n\"version\":3,\n\"file\":\"goog.promise.resolver.js\",\n\"lineCount\":12,\n\"mappings\":\"AAcAA,IAAAC,QAAA,CAAa,uBAAb,CAAA;AAEAD,IAAAE,eAAA,CAAoB,cAApB,CAAA;AAYA;;;;AAAAF,IAAAG,QAAAC,SAAA,GAAwBC,QAAQ,EAAG;CAAnC;AAOA,mCAAAL,IAAAG,QAAAC,SAAAE,UAAAH,QAAA;AAOA,6DAAAH,IAAAG,QAAAC,SAAAE,UAAAC,QAAA;AAOA,iCAAAP,IAAAG,QAAAC,SAAAE,UAAAE,OAAA;;\",\n\"sources\":[\"goog/promise/resolver.js\"],\n\"sourcesContent\":[\"// Copyright 2013 The Closure Library Authors. All Rights Reserved.\\n//\\n// Licensed under the Apache License, Version 2.0 (the \\\"License\\\");\\n// you may not use this file except in compliance with the License.\\n// You may obtain a copy of the License at\\n//\\n//      http://www.apache.org/licenses/LICENSE-2.0\\n//\\n// Unless required by applicable law or agreed to in writing, software\\n// distributed under the License is distributed on an \\\"AS-IS\\\" BASIS,\\n// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\\n// See the License for the specific language governing permissions and\\n// limitations under the License.\\n\\ngoog.provide('goog.promise.Resolver');\\n\\ngoog.forwardDeclare('goog.Promise');\\n\\n\\n\\n/**\\n * Resolver interface for promises. The resolver is a convenience interface that\\n * bundles the promise and its associated resolve and reject functions together,\\n * for cases where the resolver needs to be persisted internally.\\n *\\n * @interface\\n * @template TYPE\\n */\\ngoog.promise.Resolver = function() {};\\n\\n\\n/**\\n * The promise that created this resolver.\\n * @type {!goog.Promise<TYPE>}\\n */\\ngoog.promise.Resolver.prototype.promise;\\n\\n\\n/**\\n * Resolves this resolver with the specified value.\\n * @type {function((TYPE|goog.Promise<TYPE>|Thenable)=)}\\n */\\ngoog.promise.Resolver.prototype.resolve;\\n\\n\\n/**\\n * Rejects this resolver with the specified reason.\\n * @type {function(*=): void}\\n */\\ngoog.promise.Resolver.prototype.reject;\\n\"],\n\"names\":[\"goog\",\"provide\",\"forwardDeclare\",\"promise\",\"Resolver\",\"goog.promise.Resolver\",\"prototype\",\"resolve\",\"reject\"]\n}\n"]