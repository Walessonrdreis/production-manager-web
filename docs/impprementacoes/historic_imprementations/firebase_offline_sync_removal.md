# Migração do Firebase Offline para API Client (PostgreSQL)

## Descrição
Foi finalizada a remoção de todos os repositórios baseados em cache local e sincronização offline com o **Firebase Firestore** que estavam sendo utilizados na camada do frontend (`apps/web`). As alterações garantem que o sistema agora atua de forma 100% conectada ao nosso backend via o `apiClient`, interagindo nativamente com a nova arquitetura que se comunica com o PostgreSQL via Prisma.

## Motivação
Aderência ao Pilar 4 (Pilares Arquiteturais): 
- **Desacoplamento de Infraestrutura (DIP)**: As operações não precisam mais duplicar a lógica de salvar no Firebase em paralelo com a API, uma vez que o backend já processa tudo e salva de forma centralizada.
- Redução na duplicação e potencial conflito ou sobreposição de cache no frontend.

## O Que Foi Feito
- Removidos os seguintes arquivos e métodos associados que apontavam para o Firestore Offline Sync:
  - `FirebaseSectorRepository`
  - `FirebaseOrderRepository`
  - `FirebasePlanningRepository`
  - `FirebaseProductionRepository`
  - `FirebaseScheduleRepository`
  - `FirebaseGoalsRepository`
  - `FirebaseCustomerRepository`
  - `FirebaseCollaboratorsRepository`
  - `FirestoreService` propriamente configurado
- Todos os Repositórios oficiais (`SectorsRepository`, `OrdersRepository`, `PlanningRepository`, `ProducedRepository`, `ScheduleRepository`, `GoalsRepository`, `CustomersRepository`, `CollaboratorsRepository`) foram limpos do código de fallback (if Firebase else Api) e agora retornam estritamente o `apiClient`.
- Realizado ajuste no envio do payload evitando conflitos.
- Mantido estritamente o `firebase/auth` ativo pois a aplicação continua dependendo do `signInWithPopup`.

## Melhorias
- Menor overhead no cliente web.
- Eliminação de logs de `"Warn: Failed to save to firebase"`.
- Total uso de `types` padronizados vindos da response da API, que já segue o padrão Result.
- Simplificação da depuração de requests/responses no projeto.

## Data
13 de Maio de 2026.
