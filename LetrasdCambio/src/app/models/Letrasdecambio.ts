export class Letrasdecambio {
    id_letra: number=0;
    moneda: string="";
    monto: number=0;
    tea: number=0;
    fechav: Date=new Date(Date.now());
    fechad: Date=new Date(Date.now());
    deudor: string="";
    acreedor: string="";
    monto_recibido: number=0;
    monto_entregado: number=0;
    importe_descontado: number=0;
    importe_retenido: number=0;
}