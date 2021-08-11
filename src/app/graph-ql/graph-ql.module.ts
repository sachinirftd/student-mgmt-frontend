import { NgModule } from '@angular/core';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';



const uri ='http://localhost:3000/graphql';
export function createApollo(httpLink: HttpLink) {
    return {
        link: httpLink.create({ uri }),
        cache: new InMemoryCache(),
    };
}

@NgModule({
    exports: [
        HttpLinkModule
    ],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        }
    ],
})
export class GraphQlModule { }
