package cmd

import (
	"github.com/spf13/cobra"
)

var userCmd = &cobra.Command{
	Use:   "user",
	Short: "User commands",
}

func init() {
	rootCmd.AddCommand(userCmd)
}
