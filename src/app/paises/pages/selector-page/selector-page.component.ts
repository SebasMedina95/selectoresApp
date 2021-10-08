import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesServiceService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  constructor( private fb : FormBuilder,
               private paisesServices : PaisesServiceService ) { }

  miFormulario : FormGroup = this.fb.group({
    region    : ['', Validators.required],
    pais      : ['', Validators.required],
    fronteras : ['', Validators.required]
  });

  //Ui
  cargando : boolean = false;

  guardar(){
    alert('Le dimos click !');
  }

  /**Llenando Selectores */
  regiones  : string[] = [];
  paises    : PaisSmall[] = [];
  // fronteras : string[] = [];
  fronteras : PaisSmall[] = [];

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;

    //Cuando cambie el primer selector. []
    // this.miFormulario.get('region')?.valueChanges
    //   .subscribe( region => {
    //     console.log(region);
    //     this.paisesServices.obtenerPaisesPorRegion(region)
    //       .subscribe( (paisesres) => {
            
    //         console.log(paisesres);
    //         this.paises = paisesres;

    //       })
    //   })

    /**Cuando cambie la región */
    this.miFormulario.get('region')?.valueChanges
      .pipe( 
        tap( ( region ) => {
          console.log(region);
          this.miFormulario.get('pais')?.reset(''); //4
          this.cargando = true;
        }), //3
        switchMap( region => this.paisesServices.obtenerPaisesPorRegion(region) ) //1
      ) 
      .subscribe ( paisesRes => { //2
        console.log(paisesRes);
        this.paises = paisesRes;
        this.cargando = false; //Ya tenemos data
      })

    /**Cuando cambie el país */
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.fronteras = [];
          this.miFormulario.get('fronteras')?.reset('');
          this.cargando = true;
        }),
        switchMap( codigo => this.paisesServices.obtenerPaisPorCodigo( codigo ) ),
        switchMap( pais => this.paisesServices.obtenerPaisPorBorde(pais?.borders!) )
      )
      .subscribe( paises => {
        console.log(paises);
        // this.fronteras = pais?.borders || [];
        this.cargando = false;
        this.fronteras = paises;
      })

    // SwitchMap toma el valor resultado de un observable y a la vez lo muta y regresa el valor 
    // de otro observable, esto con la finalidad de que no nos quede el código tan complicado.
    // El segundo observable DEPENDE DEL PRIMERO.
    // 1 - Valor producto del observable this.miFormulario.get('region')?.valueChanges y debe devolver otro observable
    // 2 - Ahora region emitirá el resultado que usaremos para los paises
    // 3 - Tap dispara un efecto secundario, en este caso, purgar los valores luego de cada selección.
    // 4 - Cada vez que la región cambie, los paises se van a resetear.

  }

}
