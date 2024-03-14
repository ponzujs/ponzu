class TwoWaysTransformer {
  constructor(transformerIn, transformerOut) {
    this.transformerIn = transformerIn;
    this.transformerOut = transformerOut;
  }

  transformIn(obj, context) {
    return this.transformerIn.transform(obj, context);
  }

  transformOut(obj, context) {
    return this.transformerOut.transform(obj, context);
  }
}

module.exports = {
  TwoWaysTransformer,
};
