import { SubirArchivoService } from './../subir-archivo/subir-archivo.service';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from '../../models/usuario.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert';
import {map} from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario:Usuario;
  token:string;

  constructor(
    public router:Router,
    public _subirArchivoService:SubirArchivoService,
    public http:HttpClient
  ) {
    this.cargarStorage();
   }

  cargarStorage(){
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario'));
    }else{
      this.token = '';
      this.usuario = null;
    }
  }

  estaLogueado(){
    return (this.token.length > 5)? true:false;
  }

  guardarStorage(id:string, token:string, usuario:Usuario){
    localStorage.setItem('id',id);
    localStorage.setItem('token',token);
    localStorage.setItem('usuario',JSON.stringify(usuario));
    this.usuario = usuario;
    this.token = token;
  }

  logout(){
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  loginGoogle(token:string){
      let url = URL_SERVICIOS + '/login/google';

      return this.http.post(url, {token})
        .pipe(map((resp:any)=>{
          this.guardarStorage(resp.id,resp.token,resp.usuario);
          return true;
        }))
  }

  login(usuario:Usuario, recordar:boolean = false){
     if (recordar){
       localStorage.setItem('email', usuario.email);
       
     }else{
      localStorage.removeItem('email');
     }

      let url = URL_SERVICIOS + '/login';
      return this.http.post(url, usuario)
        .pipe(map((resp:any)=>{
          this.guardarStorage(resp.id,resp.token,resp.usuario);
          return true;
        }));
  }

  crearUsuario(usuario:Usuario){
    let url = URL_SERVICIOS + '/usuario';
    return this.http.post(url, usuario)
      .pipe(map((resp:any)=>{
        swal("Usuario Creado", usuario.email, "success");
        //console.log(resp);
        return resp.usuario;
      }));
  }

  actualizarUsuario(usuario:Usuario){
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url,usuario)
      .pipe(map((resp:any)=>{
       
         swal('Usuario actualizado', usuario.nombre, 'success');
         let usuarioDB:Usuario = resp.usuario;
         this.guardarStorage(usuarioDB._id,this.token, usuarioDB);
         return true;
      }));
  }

  cambiarImagen(archivo:File, id:string){
      this._subirArchivoService.subirArchivo(archivo,'usuarios', id)
        .then( (resp:any) => {
          console.log(resp);
          this.usuario.img = resp.usuario.img;
          swal('Imagen Actualizada', this.usuario.nombre,'success');
          this.guardarStorage(id,this.token,this.usuario);
        }).catch(resp =>{
          console.log(resp);
        })
  }

  
}
