import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateEmployeeNumberService {

    private readonly amountNumbers = 5;

    generate(count: number, queue = 1, lengthNumber = this.amountNumbers ){
        if((count+1) <= Number(''.padEnd(queue,'9'))){
            return `${''.padStart(lengthNumber-count.toString.length,'0')}${(count+1)}`;
        }
        // if((count+1) <= Number(''.padEnd(lengthNumber,'9')))
        return this.generate(count,queue +1,lengthNumber-1)
    }


}
