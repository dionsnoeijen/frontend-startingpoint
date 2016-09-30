'use strict';

import Header from './header';

class Home {

    constructor() {

        this.name = 'HENKIE';
        this.header = new Header();
    }

    greet() {

        return this.name;
    }
}

export default Home;
