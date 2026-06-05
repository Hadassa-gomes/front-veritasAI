import React, { useState, useEffect } from 'react';
import { FaFont, FaLink, FaImage, FaHistory } from 'react-icons/fa';

// Colocado o link do Render com uma proteção para ambiente local se necessário
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://back-veritasai.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Limpa estados e busca histórico se necessário ao trocar de aba
  useEffect(() => {
    setResult(null);
    setInputValue('');
    setSelectedFile(null);
    
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      if (!response.ok) throw new Error("Erro ao carregar o histórico");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  const handleVerify = async () => {
    if (activeTab !== 'image' && !inputValue.trim()) {
      return alert("Por favor, insira o conteúdo para análise!");
    }

    setLoading(true);
    setResult(null);

    try {
      let response;
      
      if (activeTab === 'text') {
        // Alinhado perfeitamente com o TextRequest do seu main.py
        response = await fetch(`${API_BASE_URL}/verify/text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: inputValue, 
            title: "VeritasAI" 
          })
        });
      } else if (activeTab === 'url') {
        // Alinhado perfeitamente com o URLRequest do seu main.py
        response = await fetch(`${API_BASE_URL}/verify/url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            url: inputValue, 
            context: "" 
          })
        });
      } else if (activeTab === 'image') {
        if (!selectedFile) return alert("Selecione uma imagem!");
        const formData = new FormData();
        // O nome da chave precisa ser exatamente 'file' igual ao parâmetro da rota no back
        formData.append('file', selectedFile); 
        
        response = await fetch(`${API_BASE_URL}/verify/image`, {
          method: 'POST',
          body: formData
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Erro na validação dos dados com o servidor.");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert(`Falha ao verificar: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Veritais 🛡️</h1>
        <p>Sistema Inteligente de Detecção de Fake News</p>
      </header>

      {/* Menu de Abas */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`} onClick={() => setActiveTab('text')}><FaFont /> Texto</button>
        <button className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`} onClick={() => setActiveTab('url')}><FaLink /> Link</button>
        <button className={`tab-btn ${activeTab === 'image' ? 'active' : ''}`} onClick={() => setActiveTab('image')}><FaImage /> Imagem</button>
        <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><FaHistory /> Histórico</button>
      </div>

      {/* Entrada de dados */}
      {activeTab !== 'history' && (
        <div className="input-section">
          {activeTab === 'text' && (
            <textarea className="input-field" rows="4" placeholder="Cole a notícia ou afirmação aqui..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          )}
          {activeTab === 'url' && (
            <input type="url" className="input-field" placeholder="https://site.com/noticia" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          )}
          {activeTab === 'image' && (
            <input type="file" className="input-field" accept="image/png, image/jpeg, image/webp" onChange={(e) => setSelectedFile(e.target.files[0])} />
          )}
          
          <button className="submit-btn" onClick={handleVerify} disabled={loading}>
            {loading ? 'Analisando com IA...' : 'Verificar Fato'}
          </button>
        </div>
      )}

      {/* Resultados em Tempo Real */}
      {result && activeTab !== 'history' && (
        <div className={`result-card ${result.verdict}`}>
          <h2>Veredito: {result.verdict} ({result.confidence}% de Certeza)</h2>
          <p><strong>Resumo:</strong> {result.summary}</p>
          <hr style={{margin: '1rem 0', opacity: 0.2}}/>
          <p style={{whiteSpace: 'pre-line'}}><strong>Análise Completa:</strong><br/>{result.analysis}</p>
        </div>
      )}

      {/* Exibição do Histórico */}
      {activeTab === 'history' && (
        <div>
          <h2>Últimas Verificações</h2>
          {history.length === 0 ? <p>Nenhum histórico encontrado.</p> : history.map(item => (
            <div key={item.id} className="history-card" style={{borderLeftColor: item.verdict === 'VERDADEIRO' ? '#10b981' : item.verdict === 'FALSO' ? '#ef4444' : '#f59e0b'}}>
              <p>
                <strong>Veredito:</strong> {item.verdict} | 
                <strong> Confiança:</strong> {item.confidence}% | 
                <strong> Tipo:</strong> {item.input_type.toUpperCase()}
              </p>
              <p style={{ marginTop: '0.5rem', color: '#475569' }}>
                <strong>Conteúdo analisado:</strong> "{item.input_value}"
              </p>
              <p style={{ marginTop: '0.25rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                <em>{item.summary}</em>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;