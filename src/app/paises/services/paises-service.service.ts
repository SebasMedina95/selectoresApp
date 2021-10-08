import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { PaisInterface, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  /**
   * https://countrylayer.com/documentation
   * https://manage.countrylayer.com/dashboard?reset_access_key=1
   */

  private _baseUrl : string = 'https://restcountries.com/v2';
  private _regiones : string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']; //Privada para no ir a comprometer los componentes.

  get regiones() : string[] {
    return [... this._regiones]; //Destructuramos para crear una copia del objeto por prevención.
  }

  constructor( private http : HttpClient ) { }

  obtenerPaisesPorRegion( region : string ) : Observable<PaisSmall[]>{
    const url : string = `${this._baseUrl}/continent/${region}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall[]>(url);
  }

  obtenerPaisPorCodigo( codigo : string ) : Observable<PaisInterface | null>{
    
    if(!codigo){
      return of(null);
    }
    
    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<PaisInterface>(url);
  }

  obtenerPaisPorCodigoChiquitin( codigo : string ) : Observable<PaisSmall>{
    
    const url = `${this._baseUrl}/alpha/${codigo}?fields=name,alpha3Code`;
    return this.http.get<PaisSmall>(url);
  }

  obtenerPaisPorBorde( borders : string[] ) : Observable<PaisSmall[]> {
    if(!borders){
      return of([]);
    }

    const peticiones : Observable<PaisSmall>[] = [];
    borders.forEach( codigo => {
      const peti = this.obtenerPaisPorCodigoChiquitin(codigo);
      peticiones.push( peti );
    });
    
    return combineLatest( peticiones );
  }


}
