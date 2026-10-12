# Recuperação de SSH e memória operacional de VM existente

## Problema, decisão e escopo

O usuário solicitou acesso a uma VM existente no Google Cloud. SSH pelo computador, Cloud Shell e navegador recusava autenticação por chave. O acesso de leitura à API do GCP funcionava. EasyPanel e n8n estavam acessíveis antes da manutenção.

Após a tentativa de diagnóstico pelo console serial, verificou-se a necessidade de uma senha local para obter uma sessão Linux por esse caminho. O usuário informou que provavelmente nunca havia configurado essa senha. Foi então preparado e revisado um script de recuperação de SSH. O usuário autorizou aplicar o script e parar/iniciar a VM, esclarecendo que os serviços não estavam em uso naquele momento.

Escolheu-se desligamento normal e nova inicialização. Confirmaram-se antes o IP reservado e o disco persistente. O script preservou as chaves existentes, aplicou a chave pública do computador no arquivo `authorized_keys`, ajustou permissões do usuário alvo e registrou diagnósticos no console serial.

Esta é uma manutenção de ambiente externo já existente. Não é implantação do LabIA e não conclui laboratórios, recursos nem checklists do produto.

## Ambiente, data e artefatos

- Medição de recursos: `2026-10-11T23:08:27-03:00`, equivalente a `2026-10-12T02:08:27Z`.
- Commit-base do repositório: `f079ecaec4968153861a3935c65d6105b23311cf`; nenhuma nova revisão foi criada.
- Cliente: Windows e PowerShell; Google Cloud SDK `504.0.1`; Bash local `5.2.37` usado para conferir a sintaxe do script.
- Host: Debian 12; Docker `20.10.24+dfsg1`, build `297e128`; tipo de VM `e2-small`.
- Script de recuperação: SHA-256 `6e2e5bb08b1704e00f6511b28bce4a54858746dea54a17352866c38dd3f13761`; cópia e backup dos metadados mantidos em diretório temporário local fora do Git.
- Memória operacional solicitada pelo usuário: `.tools/memoria-vm-gcp.md`, opcional e ignorada pelo Git. Contém coordenadas, acesso, serviços e capacidade observada. Não contém senhas, tokens nem chaves privadas.

As coordenadas e contas foram omitidas deste registro versionável. `AGENTS.md` aponta para a memória local quando disponível; um clone não depende dela.

## Comandos e resultados

Sintaxe conferida pelos comandos específicos `gcloud help compute instances describe`, `add-metadata`, `remove-metadata`, `stop`, `start`, `get-serial-port-output`, `gcloud help compute connect-to-serial-port`, `gcloud help compute ssh` e `gcloud help version`. O comando de conexão serial foi conferido com `--dry-run`; a conexão interativa não foi usada para obter uma sessão Linux. Os comandos de metadados e parada/início não oferecem `--dry-run` nessa versão.

Comandos executados abaixo, com os alvos substituídos para não registrar identificadores privados. Este bloco é um registro, não um quickstart pronto para executar:

```text
bash -n <script-local-de-recuperacao>
gcloud compute instances add-metadata <vm> --project=<projeto> --zone=<zona> --metadata-from-file=startup-script=<script-local-de-recuperacao> --quiet
gcloud compute instances stop <vm> --project=<projeto> --zone=<zona> --quiet
gcloud compute instances start <vm> --project=<projeto> --zone=<zona> --quiet
gcloud compute instances get-serial-port-output <vm> --project=<projeto> --zone=<zona> --port=1 --quiet
ssh -i <chave-local> -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=yes <usuario>@<ip> "id -un && hostname"
gcloud compute instances remove-metadata <vm> --project=<projeto> --zone=<zona> --keys="startup-script,serial-port-enable" --quiet
gcloud compute instances describe <vm> --project=<projeto> --zone=<zona> --format="json(status,lastStartTimestamp,metadata.items,networkInterfaces)" --quiet
gcloud version --format=json --quiet
```

| Verificação | Resultado observado |
|---|---|
| Sintaxe do script | `bash -n` terminou com código `0`; nenhum código de recuperação foi executado localmente. |
| Script na VM | Console serial registrou aplicação da chave, validação de `sshd_config` e conclusão do script. |
| SSH | Consulta de usuário e hostname terminou com código `0`; o usuário também confirmou uma sessão interativa. |
| Estado final | VM `RUNNING`; IP reservado mantido; metadados temporários removidos. |
| Serviços do host | Agente do Google, Docker e SSH retornaram `active`. |
| Swarm | EasyPanel, Traefik, n8n, Evolution API, PostgreSQL e Redis apresentaram `1/1` réplica. |
| EasyPanel | Consulta HTTP no host retornou `200`. |
| n8n | Consulta a `/healthz` dentro do contêiner retornou `{"status":"ok"}`. |
| Evolution API | Consulta HTTP no host retornou `200`; operação de WhatsApp não exercitada. |
| Recursos | `nproc`: `2`; RAM total `1.976 MiB`, disponível `728 MiB`; swap `0`; `/` em `84%` de uso, aproximadamente `2,5 GiB` livres. |

No host, foram executados também `docker service ls`, `docker service ps`, `docker ps`, `journalctl` filtrado para SSH/Docker, `systemctl is-active`, `docker --version`, `free -m`, `df -h /` e consultas HTTP locais. Não foram exportadas variáveis de ambiente, credenciais de aplicações nem dados de clientes.

Verificação documental: quatro arquivos lidos em UTF-8 estrito, três links locais conferidos, blocos de código balanceados, ausência de espaços finais e nenhum checklist do produto concluído. A busca pelos identificadores privados conhecidos não encontrou ocorrências nos três arquivos versionáveis desta entrega. `git check-ignore --no-index .tools/memoria-vm-gcp.md` confirmou a exclusão da memória local; `git diff --check` passou e `git diff --cached --stat` retornou vazio. Foram revisados os novos documentos e as alterações pontuais em `AGENTS.md` e no índice de evidências, preservando as alterações preexistentes do usuário.

## Limitações e pendências

- A causa original da recusa não foi isolada; o acesso voltou após reinício e execução do reparo.
- O EasyPanel passou por estado `Preparing` após o boot e depois apresentou réplica e HTTP disponíveis. Não se conclui que uma alteração isolada do script tenha causado ou resolvido esse atraso.
- Disponibilidade de réplica/HTTP não comprova workflows, banco de dados ou integração de WhatsApp de ponta a ponta. Execução funcional dessas integrações: `not_run`.
- Capacidade disponível é uma fotografia, não uma reserva. Não houve resize nem provisionamento de recursos adicionais. Custo da manutenção não medido: `null`.
- Build, testes, demo, deploy e métricas de execução do LabIA: `not_run`; métricas: `null`.
- URLs privadas das aplicações foram omitidas por preferência do usuário; não há pendência de fornecê-las para esta memória básica.
- Checklists do produto permanecem pendentes. Alterações preexistentes do usuário foram preservadas; commit e push não foram solicitados.
