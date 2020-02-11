
/**
 * Lechuga Martínez José Eduardo | 314325749 | joselechuga194@gmail.com
 */

import java.util.Scanner;

public class Tarea01Practica {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        int num1, num2, resultado;

        try {
            System.out.println("Introduce el primer numero");
            num1 = sc.nextInt();
            System.out.println("Introduce el segundo numero");
            num2 = sc.nextInt();
            resultado = mcd(num1, num2);
            System.out.println("El MCD de " + num1 + " y " + num2 + " es: " + resultado);
        } catch (Exception e) {
            System.out.println("Introduce solo numeros!");
        }

    }

    /**
     * Metodo que calcula el mcd de dos numeros
     * 
     * @param a
     * @param b
     * @return maximo común divisor de dos numeros
     */
    public static int mcd(int a, int b) {
        if (b == 0)
            return a;
        return mcd(b, a % b);
    }
}