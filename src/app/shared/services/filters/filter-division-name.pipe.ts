import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filterDivisionName'
})
export class FilterDivisionNamePipe implements PipeTransform {
    transform(data: any, divisionArr: any, type: string): any {
      
        if (type == 'business') {
            let businessArr = data;
            let divisionList = divisionArr.filter((b: any) => b.id === businessArr.divisionid);
            if (divisionList.length > 0) {
                return divisionList[0].divisionName;
            }
        } else if (type == 'facility') {
            let facilityFilter = data;
            // get division name            
             let divisionList = divisionArr.filter((b: any) => b.id === facilityFilter.divisionid);
             if (divisionList.length > 0) {
                return divisionList[0].divisionName;
            }
        }



        // data.forEach(item => {
        //     let businessArr = this.businesses.filter((b: any) => b.division_id === item.division_id);
        //     businessList.push(businessArr);
        // });
    }
}


