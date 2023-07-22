import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountNumberService {

    private readonly month = 12;
    private readonly divideMonths = 3;

    generate(number:string){
        const currentYear = new Date().getFullYear();
        const currentQuarter = new Date().getMonth() + 1;
        const quarter = (Math.ceil(currentQuarter / (this.month / this.divideMonths))) * 10;
        const lastDigits = number.toString().slice(-5);
      
        const accountNumber = `${currentYear}${quarter}${(Number(lastDigits) + 1).toString().padStart(5,'0')}`;

        return accountNumber;
    }


}
