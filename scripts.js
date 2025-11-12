const apiKeyInput = document.getElementById("apiKey");
const questionInput = document.getElementById('question');
const askButton = document.getElementById('askButton');
const gameSelect = document.getElementById('gameSelect');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');
const markdownToHTMl = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}
 
const questionAI = async (question, game, apiKey) => {
  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const pergunta = `
  ## ESPECIALIDADE
  - Você é um assistente especialista em **estratégias, builds e dicas de jogos**.
  - Seu foco é o jogo **${game}**.
  - Você responde sempre com informações atualizadas e relevantes sobre o jogo.

  ## REGRAS
  - Responda **apenas** sobre o jogo escolhido.
  - Se não souber, diga: "Não consigo responder a sua pergunta."
  - Se a pergunta não for sobre o jogo, diga: "Essa pergunta não tem relação com o jogo."
  - A data atual é ${new Date().toLocaleDateString()} — use informações de patchs atuais.
  - Responda em **Markdown** para permitir formatação no HTML.
  - Seja **direto, claro e profissional** (sem saudações).
  - O texto deve ter **no máximo 500 caracteres**.

  ## FORMATO DE RESPOSTA
  - Título da build ou dica em **negrito**.
  - Use **listas com marcadores** para itens, runas ou estratégias.
  - Use quebras de linha (\n\n) entre seções.
  - Exemplo:
    **A build mais atual para Jayce Top (patch 15.12) é:**

    **Itens:**
    - Youmuu's Ghostblade  
    - Ionian Boots of Lucidity  
    - Manamune  
    - Serylda's Grudge  
    - Edge of Night  

    **Runas:**
    - Phase Rush  
    - Manaflow Band  
    - Absolute Focus  
    - Gathering Storm  
    - Biscuit Delivery  
    - Magical Footwear  
    -------
    Aqui está a pergunta do usuario: ${question}
  `;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: pergunta
          }
        ]
      }
    ]
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

const enviarformulario = async (event) => {
  event.preventDefault()
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if (apiKey == '' || game == '' || question == '') {
    alert('pfv, preencha todos os campos')
    return
  }

  askButton.disabled = true
  askButton.textContent = "Buscando resposta.."
  askButton.classList.add('loading')

  try {
    const text = await questionAI(question, game, apiKey)
    aiResponse.querySelector('.response-content').innerHTML = markdownToHTMl(text)
    aiResponse.classList.remove('Hidden')
  } catch (error) {
    console.log('Erro:', error)
  } finally {
    askButton.disabled = false
    askButton.textContent = "Perguntar"
    askButton.classList.remove('loading')
  }

}
form.addEventListener('submit', enviarformulario);


