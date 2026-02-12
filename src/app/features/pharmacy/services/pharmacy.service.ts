import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PharmacyMapper } from '../mapper/farmacia.mapper';
import { FarmaciasResponse } from '../interfaces/firebase-farmacias.interfaces';
import { Pharmacy } from '../interfaces/farmacia.interface';
import { ConfiguracionResponse } from '../interfaces/firebase-configuracion.interfaces';
import { ConfigurationMapper } from '../mapper/configuracion.mapper';
import { Configuration } from '../interfaces/configuracion.interface';
import { forkJoin } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PharmacyService {
  private http = inject(HttpClient);

  // Señales
  public pharmacies = signal<Pharmacy[]>([]);
  public configuration = signal<Configuration>({
    patternId: [],
    anchorDate: '',
    messageNotice: ''
  });
  public isLoading = signal<boolean>(true);


  // SIGNAL COMPUTADA: La Farmacia de Guardia de HOY
  public pharmacyOnDuty = computed(() => {
    const pharmacies = this.pharmacies();
    const configuration = this.configuration();

    // Si no han cargado los datos, devolvemos null
    if (!configuration || pharmacies.length === 0) return null;

    // --- ALGORITMO MATEMÁTICO ---
    const hoy = new Date(Date.now() - 9 * 60 * 60 * 1000);
    const fechaAncla = new Date(configuration.anchorDate);

    // 1. Limpiar horas para comparar solo fechas
    hoy.setHours(0,0,0,0);
    fechaAncla.setHours(0,0,0,0);

    // 2. Calcular diferencia en días
    const milisegundosDia = 1000 * 60 * 60 * 24;
    const diffTiempo = hoy.getTime() - fechaAncla.getTime();
    const diasPasados = Math.floor(diffTiempo / milisegundosDia);

    // 3. Lógica de Turnos (Berja: Lun-Mar / Mié-Jue / Vie-Sáb-Dom)
    const semanas = Math.floor(diasPasados / 7);

    // Ajustar día semana (Lunes=0 ... Domingo=6)
    let diaSemana = hoy.getDay();
    diaSemana = (diaSemana === 0) ? 6 : diaSemana - 1;

    let slot = 0;
    if (diaSemana <= 1) slot = 0;      // Lunes (0) y Martes (1)
    else if (diaSemana <= 3) slot = 1; // Miércoles (2) y Jueves (3)
    else slot = 2;                     // Viernes (4), Sábado (5), Domingo (6)

    // 4. Fórmula del índice en el patrón
    // (semanas * 3 turnos/sem + turno actual) % longitud del patrón
    const longitudPatron = configuration.patternId.length;
    const indice = ((semanas * 3) + slot) % longitudPatron;

    // Aseguramos que el índice sea positivo (por si fechas pasadas)
    const indiceFinal = (indice + longitudPatron) % longitudPatron;

    // 5. Obtener el ID de la farmacia
    const idFarmaciaToca = configuration.patternId[indiceFinal];

    // 6. Buscar la farmacia completa en la lista
    return pharmacies.find(f => f.id === idFarmaciaToca) || null;
  });

  constructor() {
    this.loadData();
  }

  private loadData() {
    // Preparamos las peticiones
    const requestPharmacies = this.http.get<FarmaciasResponse>(`${environment.firebaseUrl}/farmacias`);
    const requestConfiguration = this.http.get<ConfiguracionResponse>(`${environment.firebaseUrl}/configuracion`);

    // Las lanzamos a la vez
    forkJoin([requestPharmacies, requestConfiguration]).subscribe({
      next: ([responsePharmacies, reponseConfiguration]) => {
        // Procesamos
        const dataPharmacies = PharmacyMapper.mapFirebasePharmacyToPharmacyArray(responsePharmacies.documents);
        this.pharmacies.set(dataPharmacies);

        // Procesamos
        const dataConfiguration = ConfigurationMapper.mapFirebaseConfigurationToConfiguration(reponseConfiguration.documents[0]);
        this.configuration.set(dataConfiguration);

        // Apagamos el loading
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }
}
