import api from './api';

/**
 * Melhora o tratamento de erros do Axios para ser mais seguro.
 */
function handleAxiosError(error) {
  if (error.response) {
    // O servidor respondeu com um código de status de erro (4xx, 5xx)
    const status = error.response.status;
    const data = error.response.data;

    // CORREÇÃO 2: Tratar o erro 401 (Unauthorized) especificamente
    if (status === 401) {
      // Tenta pegar a mensagem de erro (que o C# envia como 'Message' ou 'message')
      // O C# (new { Message = "..." }) serializa como 'message' (camelCase) por padrão
      return data.message || data.Message || "Credenciais inválidas. Verifique seu email e senha.";
    }

    // Para outros erros (400, 404, 500)
    return data.message || data.Message || 'Ocorreu um erro no servidor.';

  } else if (error.request) {
    // A requisição foi feita, mas não houve resposta
    return 'O servidor não está respondendo. Tente novamente.';
  } else {
    // Algo deu errado ao configurar a requisição (ex: erro de CORS, rede)
    console.error('Erro na requisição Axios:', error.message);
    return `Erro ao enviar requisição: ${error.message}`;
  }
}

const register = async (userData) => {
  try {
    const data = {
      Username: userData.nome, 
      Email: userData.email,   
      Password: userData.senha  
    };
    const response = await api.post('/Auth/register', data);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

const login = async (email, password) => {
  try {
    const data = {
      Email: email,     
      Password: password 
    };
    const response = await api.post('/Auth/login', data);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

const logout = () => {
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
