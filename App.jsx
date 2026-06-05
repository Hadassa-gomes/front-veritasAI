import React, { useState, useEffect } from 'react';
import { FaFont, FaLink, FaImage, FaHistory } from 'react-icons/fa';

const API_BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Busca o histórico sempre que a aba "history" for aberta
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    try {
      let response;
      
      if (activeTab === 'text') {
        response = await fetch(`${API_BASE_URL}/verify/text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputValue, title: "" })
        });
      } else if (activeTab === 'url') {
        response = await fetch(`${API_BASE_URL}/verify/url`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: inputValue, context: "" })
        });
      } else if (activeTab === 'image') {
        if (!selectedFile) return alert("Selecione uma imagem!");
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        response = await fetch(`${API_BASE_URL}/verify/image`, {
          method: 'POST',
          body: formData
        });
      }

      if (!response.ok) throw new Error("Erro na comunicação com a API");
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Falha ao verificar. Certifique-se de que o Backend (Uvicorn) está rodando.");
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

      {/* Área de Entrada de Dados */}
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

      {/* Área de Resultados */}
      {result && activeTab !== 'history' && (
        <div className={`result-card ${result.verdict}`}>
          <h2>Veredito: {result.verdict} ({result.confidence}% de Certeza)</h2>
          <p><strong>Resumo:</strong> {result.summary}</p>
          <hr style={{margin: '1rem 0'}}/>
          <p style={{whiteSpace: 'pre-line'}}><strong>Análise Completa:</strong><br/>{result.analysis}</p>
        </div>
      )}

      {/* Área do Histórico */}
      {activeTab === 'history' && (
        <div>
          <h2>Últimas Verificações</h2>
          {history.length === 0 ? <p>Nenhum histórico encontrado.</p> : history.map(item => (
            <div key={item.id} className="history-card" style={{borderLeftColor: item.verdict === 'VERDADEIRO' ? '#10b981' : item.verdict === 'FALSO' ? '#ef4444' : '#f59e0b'}}>
              <p><strong>Tipo:</strong> {item.input_type} | <strong>Veredito:</strong> {item.verdict}</p>
              <p><em>"{item.input_value}"</em></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;