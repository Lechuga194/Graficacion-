public class Tarea {
    public static void main(String[] args) {
        int[] x = new int[5];
        x[0] = 1;
        x[1] = 2;
        x[2] = 3;
        x[3] = 4;
        x[4] = 5;
        int k = 3;

        /**
         * Para probar el inciso A System.out.println(incisoA(k)); -
         */

        /*
         * Para probar inciso B System.out.println(incisoB(x));
         */

        /*
         * Para probar inciso C int[] a = incisoC(k, x);
         * 
         * for (int item : a) { System.out.println(item); }
         */
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
        int longitud;
        int gauss;
        int sumaArreglo = 0;
        int faltante;

        longitud = x.length;
        gauss = (longitud * (longitud + 1)) / 2;

        for (int item : x) {
            sumaArreglo += item;
        }

        return faltante = gauss - sumaArreglo;
    }

    /**
     * Ejercicio C de la tarea 01
     * 
     * @param k
     * @param x
     * @return Arreglo modificado
     */
    public static int[] incisoC(int k, int[] x) {
        int[] tempX1 = new int[k];
        int tempK = k - 1;
        int j = 0;
        for (int i = 0; i <= k - 1; i++) {
            tempX1[i] = x[i];
        }
        for (int i = tempK + 1; i < x.length; i++) {
            x[j] = x[i];
            j++;
        }
        for (int i = 0; i < tempX1.length; i++) {
            x[tempK] = tempX1[i];
            tempK++;
        }
        return x;

    }

}