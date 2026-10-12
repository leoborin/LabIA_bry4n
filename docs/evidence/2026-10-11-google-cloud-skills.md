# Preparação do Codex para Google Cloud

## Problema e decisão

Preparar o Codex para apoiar o LabIA com as skills oficiais de Google Cloud e os plugins identificados na consulta anterior. A instalação foi autorizada pelo usuário e realizada no perfil global do Codex; esta entrega não implementa funcionalidades do LabIA.

Instaladas todas as 136 skills de `skills/cloud`, as duas de `skills/developers` e as duas de `skills/identity` da coleção `google/skills`. Isso inclui arquitetura, Cloud Run, GKE, Cloud SQL, BigQuery, Storage, IAM, dados, IA, observabilidade e custos. A arquitetura planejada do LabIA continua começando pelo ambiente local e evoluindo para uma demonstração econômica em Cloud Run.

## Ambiente e origem

- Data da verificação: `2026-10-11T22:33:28-03:00`.
- Commit do LabIA usado como base: `f079ecaec4968153861a3935c65d6105b23311cf`.
- Ambiente: Windows; PowerShell `5.1.26100.9444`; Python `3.12.1`; Codex CLI `0.162.1`.
- Coleção: [google/skills na revisão instalada](https://github.com/google/skills/tree/4b940dd4b5f5759794cc257266cb8cb7524b7a66), licença Apache-2.0.
- Revisão fixada das skills e do marketplace: `4b940dd4b5f5759794cc257266cb8cb7524b7a66`.
- Destino das skills: `C:\Users\leona\.codex\skills`.
- Plugins: Google Cloud Developer `1.1.10` e Firebase `1.0.0`.
- Instalador padrão utilizado: `skill-installer/scripts/install-skill-from-github.py`; SHA-256 `110cc7e4e395c2c9ba070d47db7d21be5164591c35015ae364fc9c9905b08de8`.

## Comandos e resultados

A execução local foi preparada em `.tools/`, que permanece ignorado pelo Git. Os scripts, o plano com os 140 caminhos, os logs e os hashes individuais ficam apenas nesta máquina. Nenhum conteúdo das skills ou dos caches foi incorporado ao repositório.

```powershell
codex --version
python --version
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.tools\install-google-cloud.ps1'
python '.tools\verify-google-cloud.py'
python '.tools\verify-google-cloud.py' --files-only
git status --short
git diff --check
```

O script de instalação executou o instalador padrão com `--repo google/skills`, `--ref` na revisão acima, `--dest C:/Users/leona/.codex/skills`, `--method download` e os 140 caminhos obtidos das três áreas. Depois executou:

```powershell
codex plugin marketplace add google/skills --ref 4b940dd4b5f5759794cc257266cb8cb7524b7a66 --json
codex plugin add google-cloud-developer@google-plugins --json
codex plugin add firebase@openai-curated-remote --json
```

| Verificação | Resultado observado |
|---|---|
| Instalação das skills, registro do marketplace e instalação dos dois plugins | Todas as etapas terminaram com código `0`. |
| Revisão do checkout do marketplace | Coincide com a revisão fixada. |
| Integridade de arquivos | 855 arquivos conferidos contra a origem, normalizando LF/CRLF nos arquivos de texto; nenhum ausente ou divergente. |
| Descoberta via `skills/list` do Codex App Server para a pasta do LabIA | 140 de 140 skills globais reconhecidas e habilitadas; nenhum erro de carregamento. |
| Descoberta via `plugin/list` | Os dois plugins aparecem como instalados, habilitados e disponíveis, nas versões acima. |
| Skills do plugin Google Cloud Developer | As cinco skills do pacote aparecem na descoberta. |

A primeira conferência de integridade sinalizou diferenças de LF/CRLF em arquivos de apoio cuja extensão ainda não estava incluída no verificador. Após corrigir a normalização para esses formatos, a conferência `--files-only` terminou com código `0`; os arquivos instalados não precisaram de alteração. A descoberta pelo Codex já havia sido concluída sem erros.

## Limitações e próximos passos

- As novas skills estarão disponíveis no próximo turno. Reiniciar o aplicativo caso o catálogo de plugins ainda não tenha sido atualizado.
- O Firebase foi confirmado como instalado e habilitado pelo catálogo; suas ferramentas MCP e o acesso à conta Firebase ainda não foram exercitados nesta entrega.
- O MCP Developer Knowledge depende de `DEVELOPERKNOWLEDGE_API_KEY`, ausente no ambiente verificado. As skills locais estão instaladas, mas a consulta autenticada à documentação por esse MCP permanece pendente. Seguir a [configuração oficial do plugin Google](https://github.com/google/skills/blob/4b940dd4b5f5759794cc257266cb8cb7524b7a66/plugins/cloud/google-cloud-developer/README.md) quando houver projeto e credencial adequados.
- O conector BigQuery do catálogo desta sessão está `DISABLED_BY_ADMIN` e não foi instalado. As skills locais de BigQuery estão disponíveis para orientação e desenvolvimento.
- Não foram provisionados recursos, habilitadas APIs nem executadas operações de dados na nuvem. Testes de aplicação, demo, deploy e métricas do produto: `not_run`; métricas: `null`.
- Os checklists de implementação do LabIA permanecem pendentes. Não foi solicitado commit ou push.

Referências de compatibilidade: [empacotamento e marketplaces de plugins](https://developers.openai.com/plugins/build/plugins), [descoberta de skills pelo Codex App Server](https://learn.chatgpt.com/docs/app-server).
