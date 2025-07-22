export const addObject = async (object) => {
  const screenName = `${object.firstName}_${object.lastName.charAt(
    0
  )}_${Date.now()}`;
  let payload = {
    ...object,
    screenName,
  };

  return await fetch("/o/c/registrationrequests", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  });
};
