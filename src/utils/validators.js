export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email não pode estar vazio.'
    };
  }
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Por favor, insira um email válido.'
    };
  }
  
  return {
    isValid: true,
    formatted: email.trim().toLowerCase()
  };
};

export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      error: 'Senha não pode estar vazia.'
    };
  }
  
  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Senha deve ter pelo menos 6 caracteres.'
    };
  }
  
  return {
    isValid: true,
    formatted: password
  };
};

export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      error: 'Nome de usuário não pode estar vazio.'
    };
  }
  
  if (username.length < 3) {
    return {
      isValid: false,
      error: 'Nome de usuário deve ter pelo menos 3 caracteres.'
    };
  }
  
  return {
    isValid: true,
    formatted: username.trim()
  };
};

export const validateImageUrl = (url) => {
  try {
    new URL(url);
  } catch (e) {
    return {
      isValid: false,
      error: 'Por favor, insira uma URL válida.'
    };
  }

  if (!url || url.trim() === '') {
    return {
      isValid: false,
      error: 'URL não pode estar vazia.'
    };
  }
  
  return {
    isValid: true,
    formatted: url.trim()
  };
};

// Validate login form
export const validateLoginForm = (data) => {
  const emailValidation = validateEmail(data.email);
  const passwordValidation = validatePassword(data.password);
  
  const errors = {};
  
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    formattedData: {
      email: emailValidation.isValid ? emailValidation.formatted : data.email,
      password: passwordValidation.isValid ? passwordValidation.formatted : data.password
    }
  };
};

// Validate signup form
export const validateSignUpForm = (data) => {
  const emailValidation = validateEmail(data.email);
  const passwordValidation = validatePassword(data.password);
  const usernameValidation = validateUsername(data.username);
  const imageValidation = validateImageUrl(data.image);
  
  const errors = {};
  
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error;
  }
  
  if (!imageValidation.isValid) {
    errors.image = imageValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    formattedData: {
      email: emailValidation.isValid ? emailValidation.formatted : data.email,
      password: passwordValidation.isValid ? passwordValidation.formatted : data.password,
      username: usernameValidation.isValid ? usernameValidation.formatted : data.username,
      image: imageValidation.isValid ? imageValidation.formatted : data.image
    }
  };
};
