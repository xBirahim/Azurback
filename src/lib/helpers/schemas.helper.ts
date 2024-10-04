import { AnyColumn } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

/**
 * Fonction pour obtenir une colonne à partir d'une chaîne de caractères et d'un schéma Drizzle.
 * @param columnName - Le nom de la colonne sous forme de chaîne.
 * @param schema - Le schéma Drizzle contenant les colonnes.
 * @returns La colonne correspondante ou null si aucune correspondance n'est trouvée.
 */
export const getColumnByString = (columnName: string, schema: { [key: string]: AnyPgColumn }): AnyPgColumn | null => {
    for (const key in schema) {
        if (schema[key].name === columnName) {
            return schema[key];
        }
    }
    return null;
};
