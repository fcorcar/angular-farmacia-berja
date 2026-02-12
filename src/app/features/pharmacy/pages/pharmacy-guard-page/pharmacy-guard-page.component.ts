import { Component, inject } from '@angular/core';
import { PharmacyService } from '../../services/pharmacy.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-pharmacy-guard-page',
  imports: [DatePipe],
  templateUrl: './pharmacy-guard-page.component.html',
})
export default class PharmacyGuardPageComponent {
  public pharmacyService = inject(PharmacyService);
  public today = new Date();
  public city = environment.city;
}
