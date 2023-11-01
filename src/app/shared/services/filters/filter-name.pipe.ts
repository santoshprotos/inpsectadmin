import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filterName'
})
export class FilterNamePipe implements PipeTransform {
  transform(data: any, businessArr: any, type:string): any {
    
    if(type =='facility'){
      
        if(businessArr.length>0){
            // get business name 
            let facilityArr = data;
            let businessList = businessArr.filter((b: any) => b.id === facilityArr.businessId);
            
            if(businessList.length>0){
                return businessList[0].businessname;
            }
        }
       
    }

    // data.forEach(item => {
    //     let businessArr = this.businesses.filter((b: any) => b.division_id === item.division_id);
    //     businessList.push(businessArr);
    // });
  }
}


