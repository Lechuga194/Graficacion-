public class Tarea {
    public static void main(String[] args) {
        Object[] x = new Object[7];
        x[0] = "a";
        x[1] = "l";
        x[2] = "a";
        x[3] = "r";
        x[4] = "o";
        x[5] = "t";
        x[6] = "a";

        Object[] y = new Object[4];
        y[0] = 1;
        y[1] = 2;
        y[2] = 3;
        y[3] = 4;
        int k = 2;

        Object[] a = incisoC(k, y);

        for (Object item : a) {
            System.out.println(item);
        }
    }

    /**
     * Ejercicio C de la tarea 01
     * 
     * @param k
     * @param x
     * @return Arreglo modificado
     */
    public static Object[] incisoC(int k, Object[] x) {
        Object[] tempX = new Object[k];
        int j = 0;
        int pos = x.length - k;

        // Copia los k elementos a un temporal
        for (int i = 0; i < k; i++) {
            tempX[i] = x[i];
        }
        // mueve los sobrantes al inicio del original
        for (int i = k; i < x.length; i++) {
            x[j] = x[i];
            j++;
        }
        // concatena el temporal con el original a partir de la posicion x.length - k
        for (int i = 0; i < tempX.length; i++) {
            x[pos] = tempX[i];
            pos++;
        }
        return x;
    }

    public static boolean incisoA(int x) {
        for (int i = 2; i < x; i++) {
            if (x % i == 0)
                return false;
        }
        return true;
    }

    /**
     * Ejercicio b de la tarea
     * 
     * @param x
     * @return numero faltante en un arreglo
     */
    public static int incisoB(int[] x) {
        int longitud, gauss, sumaArreglo = 0;
        longitud = x.length;
        gauss = (longitud * (longitud + 1)) / 2;
        for (int item : x) {
            sumaArreglo += item;
        }
        return gauss - sumaArreglo;
    }

}