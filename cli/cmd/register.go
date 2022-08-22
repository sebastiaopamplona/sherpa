/*
Copyright © 2022 Sebastião Pamplona sebastiaopdsrp@gmail.com

*/
package cmd

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
	"syscall"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/spf13/cobra"
	"golang.org/x/term"
)

var registerCmd = &cobra.Command{
	Use:   "register",
	Short: "Register a user",
	Run: func(cmd *cobra.Command, args []string) {
		databaseURL := os.Getenv("DATABASE_URL")
		if len(databaseURL) == 0 {
			log.Fatalln("missing env var 'DATABASE_URL'")
		}

		db, err := sqlx.Connect("postgres", databaseURL)
		if err != nil {
			log.Fatalln(fmt.Sprintf("failed to connect to db, %s", err.Error()))
		}

		email, password, err := credentials()
		if err != nil {
			log.Fatalln(fmt.Sprintf("failed to get email and password, %s", err.Error()))
		}

		tx := db.MustBegin()
		tx.MustExec("INSERT INTO User (email, password) VALUES ($1, $2)", email, password)
		tx.Commit()

	},
}

func init() {
	userCmd.AddCommand(registerCmd)
}

func credentials() (string, string, error) {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Email: ")
	email, err := reader.ReadString('\n')
	if err != nil {
		return "", "", err
	}

	fmt.Print("Password: ")
	bytePassword, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		return "", "", err
	}

	password := string(bytePassword)
	return strings.TrimSpace(email), strings.TrimSpace(password), nil
}
