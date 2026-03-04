"use client";
import { useState, useEffect, useCallback } from "react";
import { GITHUB_USERNAME } from "@/app/core/data";

const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

export interface GitHubRepository {
  id: number;
  name: string;
  description: string;
  language: string;
  html_url: string;
  stargazers_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
  default_branch: string;
  watchers_count: number;
  license: {
    name: string;
  } | null;
}

export const useGitHubRepos = () => {
  const [repos, setRepos] = useState<GitHubRepository[]>([]);

  const fetchGitHubRepos = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }
      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error("Error fetching repositories:", error);
    }
  }, []);

  useEffect(() => {
    fetchGitHubRepos();
  }, [fetchGitHubRepos]);

  return repos;
};
