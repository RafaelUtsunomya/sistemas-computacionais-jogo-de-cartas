import api from './api'; // Importa sua instância configurada do Axios

/**
 * Lida com erros do Axios de forma segura, como fizemos no authService
 */
function handleAxiosError(error) {
  if (error.response) {
    // O servidor respondeu com um erro (4xx, 5xx)
    const status = error.response.status;
    const message = error.response.data.message || 'Ocorreu um erro no servidor.';
    
    if (status === 401 || status === 403) {
      return 'Acesso negado. Você não tem permissão para esta ação.';
    }
    if (status === 404) {
      return 'Recurso não encontrado.';
    }
    return message; // Retorna a mensagem de erro específica do backend
  } else if (error.request) {
    // A requisição foi feita, mas não houve resposta
    return 'O servidor não está respondendo. Tente novamente.';
  } else {
    // Erro ao configurar a requisição
    return `Erro ao enviar requisição: ${error.message}`;
  }
}

/**
 * Busca a lista de todos os usuários.
 * Corresponde ao [HttpGet] no UserController.
 */
const getAllUsers = async () => {
  try {
    // Lembre-se que o token de admin já está sendo enviado
    // automaticamente pelo interceptor do 'api.js'
    // CORRIGIDO: Removido o '/api' do início.
    const response = await api.get('/User/allUsers'); 
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

/**
 * Atualiza um usuário específico.
 * Corresponde ao [HttpPut("{userId}")] no UserController.
 */
const updateUser = async (userId, userData) => {
  try {
    // O userData deve ser um objeto { username, email, role }
    // CORRIGIDO: Removido o '/api' do início.
    const response = await api.put(`/User/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

/**
 * Exclui um usuário específico.
 * Corresponde ao [HttpDelete("{userId}")] no UserController.
 */
const deleteUser = async (userId) => {
  try {
    // CORRIGIDO: Removido o '/api' do início.
    await api.delete(`/User/${userId}`);
    // O Delete não retorna conteúdo, então só retornamos true
    return true; 
  } catch (error) {
    throw new Error(handleAxiosError(error));
  }
};

// Exporta todos os métodos em um objeto
const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
};

export default userService;



