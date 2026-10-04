# Workers Python

**Estado: pendente.** Processamento de dados, modelos e tarefas aceitas pela API.

- [ ] Definir dependências e versões em `pyproject.toml` e `requirements.lock`.
- [ ] Implementar dispatcher, concorrência limitada, leases e tentativas.
- [ ] Implementar os módulos `risk`, `documents`, `agents` e `classification`.
- [ ] Persistir resultados tipados, versionados e consultáveis.
- [ ] Propagar deadlines e registrar falhas, cancelamento e recuperação.
- [ ] Adicionar testes CPU com fixtures sintéticas pequenas.
- [ ] Separar execução de inferência dos jobs de treinamento.

Treinos e avaliações não executados devem permanecer como `not_run`, sem métricas fictícias.
