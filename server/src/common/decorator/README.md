Para usar o `reflect-metadata` em decorators para adicionar metadados a classes, métodos, atributos e parâmetros, você pode criar decorators personalizados para cada um desses casos. Vou dar um exemplo para cada um:

1. **Decorator de Classe**:
   
   Você pode criar um decorator para adicionar metadados a uma classe da seguinte maneira:

   ```typescript
   import "reflect-metadata";

   function ClasseDecorator(metadata: any) {
       return function (target: Function) {
           Reflect.defineMetadata('classeMetadata', metadata, target);
       };
   }

   @ClasseDecorator({ descricao: 'Esta é uma classe decorada' })
   class MinhaClasse {
       // ...
   }

   // Recuperar o metadado associado à classe
   const classeMetadata = Reflect.getMetadata('classeMetadata', MinhaClasse);
   console.log(classeMetadata); // { descricao: 'Esta é uma classe decorada' }
   ```

2. **Decorator de Método**:

   Para adicionar metadados a métodos de uma classe:

   ```typescript
   import "reflect-metadata";

   function MetodoDecorator(metadata: any) {
       return function (target: any, key: string, descriptor: PropertyDescriptor) {
           Reflect.defineMetadata('metodoMetadata', metadata, target, key);
       };
   }

   class MinhaClasse {
       @MetodoDecorator({ descricao: 'Este é um método decorado' })
       meuMetodo() {
           // ...
       }
   }

   // Recuperar o metadado associado ao método
   const metodoMetadata = Reflect.getMetadata('metodoMetadata', MinhaClasse.prototype, 'meuMetodo');
   console.log(metodoMetadata); // { descricao: 'Este é um método decorado' }
   ```

3. **Decorator de Atributo**:

   Para adicionar metadados a atributos de uma classe:

   ```typescript
   import "reflect-metadata";

   function AtributoDecorator(metadata: any) {
       return function (target: any, key: string) {
           Reflect.defineMetadata('atributoMetadata', metadata, target, key);
       };
   }

   class MinhaClasse {
       @AtributoDecorator({ descricao: 'Este é um atributo decorado' })
       meuAtributo: string;
   }

   // Recuperar o metadado associado ao atributo
   const atributoMetadata = Reflect.getMetadata('atributoMetadata', MinhaClasse.prototype, 'meuAtributo');
   console.log(atributoMetadata); // { descricao: 'Este é um atributo decorado' }
   ```

4. **Decorator de Parâmetro**:

   Para adicionar metadados a parâmetros de métodos de uma classe:

   ```typescript
   import "reflect-metadata";

   function ParametroDecorator(metadata: any) {
       return function (target: any, key: string | symbol, index: number) {
           Reflect.defineMetadata('parametroMetadata', metadata, target, key);
       };
   }

   class MinhaClasse {
       meuMetodo(@ParametroDecorator({ descricao: 'Este é um parâmetro decorado' }) parametro: string) {
           // ...
       }
   }

   // Recuperar o metadado associado ao parâmetro
   const parametroMetadata = Reflect.getMetadata('parametroMetadata', MinhaClasse.prototype, 'meuMetodo');
   console.log(parametroMetadata); // { descricao: 'Este é um parâmetro decorado' }
   ```

Lembre-se de que o `reflect-metadata` é usado para adicionar e recuperar metadados personalizados em tempo de execução e pode ser especialmente útil em contextos avançados, como na criação de bibliotecas ou estruturas que precisam de informações adicionais associadas a classes, métodos, atributos ou parâmetros. Certifique-se de importar o `reflect-metadata` e configurar seu ambiente corretamente antes de usar esses decorators.