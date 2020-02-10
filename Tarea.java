public class Tarea {
    public static void main(String[] args) {
        int[] x = new int[5];
        x[0] = 1;
        x[1] = 2;
        x[2] = 3;
        x[3] = 4;
        x[4] = 5;
        int k = 8;

        /**
         * Para probar el inciso A System.out.println(incisoA(k));
         * -
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
        int[] tempX2 = new int[x.length - k];
        int tempK = k;

        for (int i = 0; i <= k - 1; i++) {
            tempX1[i] = x[i];
        }

        for (int i = 0; i < x.length - k; i++) {
            tempX2[i] = x[tempK];
            tempK++;
        }

        for (int i = 0; i <= tempX2.length - 1; ++i) {
            x[i] = tempX2[i];
        }

        tempK = k - 1;

        for (int i = 0; i < tempX1.length; i++) {
            x[tempK] = tempX1[i];
            tempK++;
        }

        return x;
    }

}