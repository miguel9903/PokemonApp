function setvalidField(element, feedback, message) {
  if (
    element.classList.contains("is-invalid") &&
    feedback.classList.contains("invalid-feedback")
  ) {
    element.classList.replace("is-invalid", "is-valid");
    feedback.classList.replace("invalid-feedback", "valid-feedback");
  } else {
    element.classList.add("is-valid");
    feedback.classList.add("valid-feedback");
  }
  feedback.textContent = message;
}

const setInvalidField = (element, feedback, message) => {
  if (
    element.classList.contains("is-valid") &&
    feedback.classList.contains("valid-feedback")
  ) {
    element.classList.replace("is-valid", "is-invalid");
    feedback.classList.replace("valid-feedback", "invalid-feedback");
  } else {
    element.classList.add("is-invalid");
    feedback.classList.add("invalid-feedback");
  }
  feedback.textContent = message;
};

// Validate search input
const validateSearchInput = (element, feedback) => {
  let validation = false;
  let regEx = /^[A-Za-z]+[a-zñáéíóú]+$/;
  const elementValue = element.value;
  if (elementValue.trim().length >= 3) {
    if (!regEx.test(elementValue)) {
      setInvalidField(
        element,
        feedback,
        "The field cannot contain numbers or special characters"
      );
    } else {
      setvalidField(element, feedback, "");
      validation = true;
    }
  } else {
    setInvalidField(
      element,
      feedback,
      "Complete this field. Please enter at least three characters"
    );
  }
  return validation;
}

// Validate empty field
function validateEmptyField(element, feedback, message) {
  let validation = false;
  const elementValue = element.value;
  if (elementValue.trim().length == 0) {
    setInvalidField(element, feedback, message);
  } else {
    validation = true;
  }
  return validation;
}

// Validate string length
const validateStringLength = (element, feedback, min, max, mesaage) => {
  let validation = false;
  const elementValue = element.value;
  if (elementValue.trim().length > 0) {
    if (
      elementValue.trim().length >= min &&
      elementValue.trim().length <= max
    ) {
      setvalidField(element, feedback, "");
      validation = true;
    } else {
      setInvalidField(element, feedback, mesaage);
    }
  } else {
    setInvalidField(element, feedback, "Complete this field");
  }
  return validation;
};
