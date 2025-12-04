// api.js - Cliente para consumir a API do backend
const API_URL = 'http://localhost:5000/api';

// Classe para gerenciar a API
class OrchestraAPI {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    // Headers para requisições
    getHeaders(needsAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (needsAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // ===== AUTENTICAÇÃO =====
    
    async login(email, senha) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ email, senha })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao fazer login');
            }
            
            // Salvar token
            this.token = data.token;
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            return data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    async registro(nome, email, senha) {
        try {
            const response = await fetch(`${API_URL}/auth/registro`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ nome, email, senha })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao registrar');
            }
            
            return data;
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return !!this.token;
    }

    getUsuario() {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    }

    // ===== CURSOS =====

    async getCursos(filtros = {}) {
        try {
            const params = new URLSearchParams();
            if (filtros.categoria) params.append('categoria', filtros.categoria);
            if (filtros.nivel) params.append('nivel', filtros.nivel);
            if (filtros.busca) params.append('busca', filtros.busca);
            
            const response = await fetch(`${API_URL}/cursos?${params}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao buscar cursos');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar cursos:', error);
            throw error;
        }
    }

    async getCurso(id) {
        try {
            const response = await fetch(`${API_URL}/cursos/${id}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao buscar curso');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar curso:', error);
            throw error;
        }
    }

    async criarCurso(cursoData) {
        try {
            const response = await fetch(`${API_URL}/cursos`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(cursoData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao criar curso');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao criar curso:', error);
            throw error;
        }
    }

    async atualizarCurso(id, cursoData) {
        try {
            const response = await fetch(`${API_URL}/cursos/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify(cursoData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao atualizar curso');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao atualizar curso:', error);
            throw error;
        }
    }

    async deletarCurso(id) {
        try {
            const response = await fetch(`${API_URL}/cursos/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(true)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao deletar curso');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao deletar curso:', error);
            throw error;
        }
    }

    // ===== PARTITURAS =====

    async getPartituras(filtros = {}) {
        try {
            const params = new URLSearchParams();
            if (filtros.instrumento) params.append('instrumento', filtros.instrumento);
            if (filtros.dificuldade) params.append('dificuldade', filtros.dificuldade);
            if (filtros.busca) params.append('busca', filtros.busca);
            
            const response = await fetch(`${API_URL}/partituras?${params}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao buscar partituras');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar partituras:', error);
            throw error;
        }
    }

    async getPartitura(id) {
        try {
            const response = await fetch(`${API_URL}/partituras/${id}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao buscar partitura');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar partitura:', error);
            throw error;
        }
    }

    async criarPartitura(partituraData) {
        try {
            const response = await fetch(`${API_URL}/partituras`, {
                method: 'POST',
                headers: this.getHeaders(true),
                body: JSON.stringify(partituraData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao criar partitura');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao criar partitura:', error);
            throw error;
        }
    }

    async atualizarPartitura(id, partituraData) {
        try {
            const response = await fetch(`${API_URL}/partituras/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(true),
                body: JSON.stringify(partituraData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao atualizar partitura');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao atualizar partitura:', error);
            throw error;
        }
    }

    async deletarPartitura(id) {
        try {
            const response = await fetch(`${API_URL}/partituras/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders(true)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao deletar partitura');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao deletar partitura:', error);
            throw error;
        }
    }

    // ===== ADMIN - ESTATÍSTICAS =====

    async getEstatisticas() {
        try {
            const response = await fetch(`${API_URL}/admin/estatisticas`, {
                headers: this.getHeaders(true)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao buscar estatísticas');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            throw error;
        }
    }

    async getAtividades() {
        try {
            const response = await fetch(`${API_URL}/admin/atividades`, {
                headers: this.getHeaders(true)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao buscar atividades');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar atividades:', error);
            throw error;
        }
    }

    async getCursosPopulares() {
        try {
            const response = await fetch(`${API_URL}/admin/cursos-populares`, {
                headers: this.getHeaders(true)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.erro || 'Erro ao buscar cursos populares');
            }
            
            return data;
        } catch (error) {
            console.error('Erro ao buscar cursos populares:', error);
            throw error;
        }
    }
}

// Criar instância global
const api = new OrchestraAPI();

// Exportar para uso nos scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrchestraAPI;
}
