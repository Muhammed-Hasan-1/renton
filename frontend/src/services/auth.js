export const getToken = () => {
  return (
    sessionStorage.getItem("rentonToken") ||
    sessionStorage.getItem("token")
  );
};

export const getUser = () => {
  const user = sessionStorage.getItem("rentonUser");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const setSession = (token, user) => {
  sessionStorage.setItem("rentonToken", token);
  sessionStorage.setItem("token", token);
  if (user) {
    sessionStorage.setItem("rentonUser", JSON.stringify(user));
  }

  // Clear persistent localStorage to ensure sessions reset when tab closes
  localStorage.removeItem("rentonToken");
  localStorage.removeItem("token");
  localStorage.removeItem("rentonUser");
};

export const clearSession = () => {
  sessionStorage.removeItem("rentonToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("rentonUser");

  localStorage.removeItem("rentonToken");
  localStorage.removeItem("token");
  localStorage.removeItem("rentonUser");
};
