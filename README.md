## Trabalho de Sistemasde Informaçõo Distribuídos
Por que o Selenium é um saco de configurar e colocar a rodar o processo inteiro esta 
abstraído dentro de um container docker. Após instalar o Docker (e docker-compose se 
necessário) deve-se executar o seguinte comando para levantar o Grid Selenium:
```shell script
docker-compose up
```
Após isso o grid console pode ser acessado via http://localhost:4444/grid/console


Devido a falta de documentação e deocumentação conflitante com python, Java e outras
linguagens a lingua optada para a execução das instruções do Selenium foi o Javascript
através do Node.js (que deve estar instaladoe disponível no PATH na máquina em que 
for ser executado):
```shell script
npm install
node index.js
```
