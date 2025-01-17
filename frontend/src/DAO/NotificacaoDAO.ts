import { RemoteMongoDatabase } from 'mongodb-stitch-browser-sdk';
import { Node } from 'slate/dist/interfaces/node';

const COLLECTION = 'notifications';

export interface Notificacao {
  _id?: unknown;
  titulo: string;
  texto: Node[];
  enviar_para: 'all' | Array<unknown>;
  visto_por: Array<unknown>;
  criadoAs: Date;
  dataExpiracao: Date;
}

interface NotificacaoDAO {
  db: RemoteMongoDatabase | null;
  setDb: (db: RemoteMongoDatabase) => any;
  findAll: () => any;
  update: (query: any, changes: any) => any;
  insert: (notification: any) => any;
  ciente: (notification_id: any, user_id: any) => any;
  filterNotificationsByUser: (notification: Array<Notificacao>, userLogged: any) => Array<Notificacao>
}

const NotificacaoDAO: NotificacaoDAO = {
  db: null,
  setDb(db: RemoteMongoDatabase) {
    this.db = db;
  },
  findAll() {
    if (this.db) {
      return this.db.collection(COLLECTION).find({}).toArray();
    }
  },
  update(query: any, changes: any) {
    if (this.db) {
      return this.db
        .collection(COLLECTION)
        .updateMany(query, { $set: changes });
    }
  },
  insert(notification) {
    if (this.db) {
      return this.db.collection(COLLECTION).insertOne(notification);
    }
  },
  ciente(notification_id, user_id) {
    if (this.db) {
      return this.db
        .collection(COLLECTION)
        .updateOne({ _id: notification_id }, { $push: { visto_por: user_id } });
    }
  },
  filterNotificationsByUser(
      notifications,
      userLogged
  ): Array<Notificacao> {
    return notifications.filter((notification: Notificacao) => {
      let visto = false;
      notification.visto_por.forEach((usuario_id: any) => {
        if (usuario_id.toString() === userLogged._id.toString()) {
          visto = true;
        }
      });
      return !visto;
    });
  }
};

export default NotificacaoDAO;
