"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronDownIcon, CopyIcon } from "./icons";
import { ChevronRight } from "lucide-react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface MCPToolResultProps {
  toolName: string;
  result: any;
}

const formatValue = (value: any): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  return JSON.stringify(value, null, 2);
};

const renderValue = (
  key: string,
  value: any,
  depth: number = 0
): React.ReactNode => {
  if (value === null || value === undefined) {
    return (
      <span className="text-muted-foreground italic">
        {value === null ? "null" : "undefined"}
      </span>
    );
  }

  if (typeof value === "string") {
    return (
      <span className="text-green-600 dark:text-green-400">
        &quot;{value}&quot;
      </span>
    );
  }

  if (typeof value === "number") {
    return <span className="text-blue-600 dark:text-blue-400">{value}</span>;
  }

  if (typeof value === "boolean") {
    return (
      <span className="text-purple-600 dark:text-purple-400">
        {String(value)}
      </span>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-muted-foreground">[]</span>;
    }

    return (
      <div className="space-y-1">
        <span className="text-muted-foreground">[</span>
        <div className="ml-4 space-y-1">
          {value.map((item, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-muted-foreground">{index}:</span>
              {renderValue(String(index), item, depth + 1)}
            </div>
          ))}
        </div>
        <span className="text-muted-foreground">]</span>
      </div>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) {
      return <span className="text-muted-foreground">{"{}"}</span>;
    }

    return (
      <div className="space-y-1">
        <span className="text-muted-foreground">{"{"}</span>
        <div className="ml-4 space-y-1">
          {entries.map(([objKey, objValue]) => (
            <div key={objKey} className="flex gap-2">
              <span className="text-orange-600 dark:text-orange-400">
                {objKey}:
              </span>
              {renderValue(objKey, objValue, depth + 1)}
            </div>
          ))}
        </div>
        <span className="text-muted-foreground">{"}"}</span>
      </div>
    );
  }

  return <span>{String(value)}</span>;
};

const detectError = (result: any): boolean => {
  if (!result) return false;

  // Check if result is an error object
  if (result instanceof Error) return true;

  // Check for common error properties
  if (typeof result === "object") {
    // Check for explicit error indicators
    if (result.error || result.errors) return true;
    if (result.status === "error" || result.success === false) return true;
    if (result.isError === true || result.failed === true) return true;

    // Check for HTTP error status codes
    if (typeof result.statusCode === "number" && result.statusCode >= 400)
      return true;
    if (typeof result.status === "number" && result.status >= 400) return true;

    // Check for error message patterns
    if (result.message && typeof result.message === "string") {
      const errorPatterns =
        /error|failed|exception|invalid|unauthorized|forbidden|not found|bad request/i;
      if (errorPatterns.test(result.message)) return true;
    }

    // Check for error type
    if (result.type && typeof result.type === "string") {
      if (result.type.toLowerCase().includes("error")) return true;
    }
  }

  return false;
};

export const MCPToolResult: React.FC<MCPToolResultProps> = ({
  toolName,
  result,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const isComplexResult = typeof result === "object" && result !== null;
  const hasError = detectError(result);
  const resultSummary = isComplexResult
    ? `${
        Array.isArray(result)
          ? `Array (${result.length} items)`
          : `Object (${Object.keys(result).length} properties)`
      }`
    : formatValue(result);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">Tool Result</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {toolName}
            </Badge>
            <Badge
              variant={hasError ? "destructive" : "default"}
              className={`text-xs flex items-center gap-1 font-sans ${
                hasError
                  ? "bg-red-200 text-red-800"
                  : "bg-green-100 text-green-800 border-green-200"
              }`}
            >
              <div
                className={`size-2 rounded-full ${
                  hasError ? "bg-red-500 animate-pulse" : "bg-green-500"
                }`}
              />
              {hasError ? "ERROR" : "SUCCESS"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="size-7 p-0"
                >
                  <CopyIcon size={12} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Copied!" : "Copy JSON"}
              </TooltipContent>
            </Tooltip>
            {isComplexResult && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="size-7 p-0"
              >
                {isExpanded ? (
                  <ChevronDownIcon size={12} />
                ) : (
                  <ChevronRight className="size-3" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {!isComplexResult || !isExpanded ? (
          <div className="text-sm text-muted-foreground font-mono">
            {isComplexResult && !isExpanded ? (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="hover:text-foreground transition-colors"
              >
                {resultSummary}{" "}
                <span className="text-xs">(click to expand)</span>
              </button>
            ) : (
              renderValue("root", result)
            )}
          </div>
        ) : (
          <div className="text-sm font-mono space-y-1 max-h-96 overflow-y-auto">
            {renderValue("root", result)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
