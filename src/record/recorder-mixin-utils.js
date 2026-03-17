function applyPrototypeMixin(TargetClass, MixinClass) {
  const descriptors = Object.getOwnPropertyDescriptors(MixinClass.prototype);
  delete descriptors.constructor;
  Object.defineProperties(TargetClass.prototype, descriptors);
}

export { applyPrototypeMixin };
