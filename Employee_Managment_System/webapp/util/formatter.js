sap.ui.define([], function () {
  return {
    convertToCaps: function (inp) {
      if (inp) {
        return inp.toUpperCase();
      }
    },
    convertToBool: function () {},
    joinTwo: function (a, b) {
      return a + "  " + b;
    },
  };
});

//we need an obj of this to WORK!!
// TO THE MAIN CONTROLLER!!>>>>
