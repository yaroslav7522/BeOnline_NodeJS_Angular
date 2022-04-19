
// @ts-ignore
import {ElementRef} from "@angular/core";

// @ts-ignore
declare var M

export class MaterialService {
  static toast(message: string){
    M.toast({html: message})
  }

  static initFloatingButtons(ref: ElementRef){
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static initDropdown(ref: ElementRef){
    let DD = M.Dropdown.init(ref.nativeElement)
  }

  static initDatepicker(ref: ElementRef, cdate?: Date){
    let options = {
      'format': 'dd.mm.yyyy',
      'defaultDate': cdate,
      'setDefaultDate': false,
    }
    if(cdate){
      options.setDefaultDate = true
      options.defaultDate = cdate
    }
    M.Datepicker.init(ref.nativeElement, options)
  }

  static InitTabs(ref: ElementRef){
    let options = {
      'swipeable': true
    }
    M.Tabs.init(ref.nativeElement, options)
  }

  static InitPopup(ref: ElementRef){
    M.Modal.init(ref.nativeElement)
  }

  static InitSelect(ref: ElementRef){
    M.FormSelect.init(ref.nativeElement)
  }

  static getPopupInstance(ref: ElementRef){
    return M.Modal.getInstance(ref.nativeElement);
  }

  static UpdateTxtFields(){
    M.updateTextFields()
  }
}
