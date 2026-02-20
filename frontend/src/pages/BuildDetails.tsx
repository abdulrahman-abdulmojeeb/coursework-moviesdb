import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Database,
  Container,
  Layers,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Code,
} from "lucide-react"
import { cn } from "@/lib/utils"
import InfoCard from "@/components/InfoCard"
import {
  stackSections,
  architectureDetails,
  databaseSchema,
  queryCategories,
} from "@/data/build-details"
import type { TechItem, QueryInfo, QueryCategory } from "@/data/build-details"


function TechCard({ item }: { item: TechItem }) {
  return (
    <div className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.name}</span>
          {item.version && <Badge variant="secondary" className="text-xs">v{item.version}</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
      {item.link && (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

function QueryCard({ query }: { query: QueryInfo }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(query.sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const methodColors = {
    GET: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    POST: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    PUT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            {isOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            <div>
              <p className="font-medium text-sm">{query.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn("text-xs", methodColors[query.method])}>{query.method}</Badge>
                <code className="text-xs text-muted-foreground">{query.endpoint}</code>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-10 pr-3 pb-3 space-y-3">
          <p className="text-sm text-muted-foreground">{query.description}</p>
          <div className="relative">
            <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto"><code>{query.sql}</code></pre>
            <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-7 px-2" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function CategoryCard({ category }: { category: QueryCategory }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {category.name}
                  <Badge variant="secondary">{category.queries.length}</Badge>
                </CardTitle>
                <CardDescription className="mt-1">{category.description}</CardDescription>
              </div>
              {isOpen ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="divide-y">
              {category.queries.map((query, index) => <QueryCard key={index} query={query} />)}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}


function TechStackContent() {
  return (
    <div className="space-y-6">
      {/* Architecture Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Architecture Overview</CardTitle>
          <CardDescription>Multi-tier architecture with containerized microservices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Layer</TableHead>
                <TableHead className="whitespace-nowrap">Components</TableHead>
                <TableHead className="whitespace-nowrap">Responsibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {architectureDetails.map((layer) => (
                <TableRow key={layer.layer}>
                  <TableCell className="font-medium whitespace-nowrap">{layer.layer}</TableCell>
                  <TableCell><code className="text-xs bg-muted px-1 py-0.5 rounded">{layer.components}</code></TableCell>
                  <TableCell className="text-muted-foreground">{layer.responsibility}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Database Schema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" />Database Schema</CardTitle>
          <CardDescription>PostgreSQL tables and record counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Table</TableHead>
                <TableHead className="text-right whitespace-nowrap">Records</TableHead>
                <TableHead className="whitespace-nowrap">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databaseSchema.map((table) => (
                <TableRow key={table.table}>
                  <TableCell><code className="text-sm">{table.table}</code></TableCell>
                  <TableCell className="text-right font-mono">{table.records}</TableCell>
                  <TableCell className="text-muted-foreground">{table.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      {stackSections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">{section.icon}{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {section.technologies.map((tech) => <TechCard key={tech.name} item={tech} />)}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Docker Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Container className="h-5 w-5" />Docker Services</CardTitle>
          <CardDescription>Container configuration and networking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Service</TableHead>
                <TableHead className="whitespace-nowrap">Container</TableHead>
                <TableHead className="whitespace-nowrap">Image</TableHead>
                <TableHead className="whitespace-nowrap">Ports</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell className="font-medium">db</TableCell><TableCell><code>movielens-db</code></TableCell><TableCell><code>postgres:16-alpine</code></TableCell><TableCell><code>5432:5432</code></TableCell></TableRow>
              <TableRow><TableCell className="font-medium">backend</TableCell><TableCell><code>movielens-backend</code></TableCell><TableCell><code>custom</code></TableCell><TableCell><code>8001:8000</code></TableCell></TableRow>
              <TableRow><TableCell className="font-medium">frontend</TableCell><TableCell><code>movielens-frontend</code></TableCell><TableCell><code>custom</code></TableCell><TableCell><code>443:443, 80:80</code></TableCell></TableRow>
              <TableRow><TableCell className="font-medium">pgadmin</TableCell><TableCell><code>movielens-pgadmin</code></TableCell><TableCell><code>dpage/pgadmin4</code></TableCell><TableCell><code>5050:80</code></TableCell></TableRow>
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SQLQueriesContent() {
  const totalQueries = queryCategories.reduce((sum, cat) => sum + cat.queries.length, 0)

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {totalQueries} queries across {queryCategories.length} categories used in the application
      </p>

      <div className="space-y-4">
        {queryCategories.map((category, index) => <CategoryCard key={index} category={category} />)}
      </div>

      <InfoCard>
        <p><strong>About:</strong> These SQL queries are executed using psycopg2 against PostgreSQL 16.</p>
        <p><strong>Database Access:</strong> Use pgAdmin at <a href="https://db-comp22-cw.marlin.im" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://db-comp22-cw.marlin.im</a></p>
      </InfoCard>
    </div>
  )
}


export default function BuildDetails() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="h-6 w-6" />
          Build Details
        </h1>
        <p className="text-muted-foreground">
          Technical specifications, architecture, and SQL documentation
        </p>
      </div>

      <Tabs defaultValue="stack" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stack" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Tech Stack
          </TabsTrigger>
          <TabsTrigger value="queries" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            SQL Queries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stack">
          <TechStackContent />
        </TabsContent>

        <TabsContent value="queries">
          <SQLQueriesContent />
        </TabsContent>
      </Tabs>

      <InfoCard>
        <p><strong>Project:</strong> MoviesDB - Film Analytics Dashboard for COMP0022 Databases & Information Systems coursework at UCL.</p>
        <p><strong>Data Source:</strong> MovieLens ml-latest-small dataset enriched with TMDB API metadata. Personality data is synthetically generated.</p>
      </InfoCard>
    </div>
  )
}
